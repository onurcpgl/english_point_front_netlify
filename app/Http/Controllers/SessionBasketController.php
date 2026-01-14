<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SessionBasket;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\CourseSessionUser;
use App\Models\CourseSession;
use App\Events\SessionQuotaUpdated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Events\SessionUserJoined;
class SessionBasketController extends Controller
{
    // Sepeti listeleme
    public function index(Request $request)
    {
        $basket = $this->getBasket($request);

        return response()->json([
            'success' => true,
            'basket' => $basket
        ]);
    }
    public function add(Request $request)
    {
        $request->validate([
            'course_session_id' => 'required|integer',
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        // 1️⃣ KONTROL NOKTASI: Kullanıcı bu eğitimi daha önce alıp tamamlamış mı?
        $lastRecord = SessionBasket::where('user_id', $user->id)
            ->where('course_session_id', $request->course_session_id)
            ->latest('id') // ID'ye veya created_at'e göre en sonuncuyu getirir
            ->first();

        // 2. Kontrol:
// - Kayıt var mı? ($lastRecord true mu?)
// - VARSA, bu son kaydın durumu 'completed' mı?
        $alreadyPurchased = $lastRecord && $lastRecord->status === 'completed';

        // Eğer tamamlanmış bir kayıt varsa işlemi durdur ve hata dön
        if ($alreadyPurchased) {
            return response()->json([
                'success' => false,
                'message' => 'Bu eğitimi zaten satın aldınız.',
            ], 200);
        }

        // -------------------------------------------------------------
        // Eğer satın almamışsa aşağıdaki normal sepet akışı devam eder
        // -------------------------------------------------------------

        SessionBasket::where('user_id', $user->id)
            ->where('status', 'pending')
            ->get()
            ->each(function ($basket) {
                // created_at sabit kalsın diye timestamps kapatıyoruz
                $basket->timestamps = false;
                $basket->update(['status' => 'cancelled']);

                // Şimdi timestamps'i tekrar aktif edip updated_at'i manuel güncelliyoruz
                $basket->timestamps = true;
                $basket->forceFill(['updated_at' => now()])->save();
            });

        // Yeni eğitimi sepete ekle
        $newBasket = SessionBasket::create([
            'user_id' => $user->id,
            'course_session_id' => $request->course_session_id,
            'description' => "Eğitim sepete eklendi.",
            'status' => 'pending',
        ]);

        // 🔥 relation'ı yükle
        $newBasket->load([
            'courseSession.cafe',
            'courseSession.googleCafe'
        ]);

        return response()->json([
            'success' => true,
            'basket' => $newBasket,
        ]);
    }


    public function update(Request $request)
    {
        $request->validate([
            'basket_id' => 'required|integer',
        ]);

        $user = JWTAuth::parseToken()->authenticate();


        $transactionResult = DB::transaction(function () use ($request, $user) {

            $attendanceCode = random_int(100000, 999999);

            // Sepetteki ilgili ürünü bul
            $basketItem = SessionBasket::where('id', $request->basket_id)
                ->where('user_id', $user->id)
                ->first();

            if (!$basketItem) {
                // Başarısız durum
                return [
                    'success' => false,
                    'message' => 'Sepet içeriği bulunamadı, lütfen daha sonra tekrar deneyiniz.'
                ];
            }

            // --- CRITICAL SECTION (KİLİTLEME BAŞLIYOR) ---
            // İlgili eğitimi bul ve KİLİTLE (lockForUpdate).
            // Bu satır çalıştığında, bu eğitim satırı başkaları için geçici olarak dondurulur.
            $courseSession = CourseSession::where('id', $basketItem->course_session_id)
                ->lockForUpdate()
                ->first();

            // KONTENJAN KONTROLÜ
            // Güncel kayıt sayısını, tablo kilitliyken sayıyoruz.
            $currentCount = CourseSessionUser::where('course_session_id', $courseSession->id)
                ->where('is_completed', true)
                ->count();

            // Eğer kota sütununun adı 'quota' ise (değilse burayı düzelt):
            if ($currentCount >= $courseSession->quota) {
                return [
                    'success' => false,
                    'message' => 'Üzgünüz, işlem sırasında kontenjan dolmuştur.'
                ];
            }

            // ÖNCEKİ KAYIT KONTROLÜ
            // Aynı kullanıcı ve aynı eğitime daha önce completed yapılmış kayıtlar

            $lastRecord = SessionBasket::where('user_id', $user->id)
                ->where('course_session_id', $request->course_session_id)
                ->latest('id') // ID'ye veya created_at'e göre en sonuncuyu getirir
                ->first();


            $previousCompleted = $lastRecord && $lastRecord->status === 'completed';

            if ($previousCompleted) {
                // Mevcut sepet (gelen basket) iptal ediliyor
                $basketItem->timestamps = false;
                $basketItem->update([
                    'status' => 'cancelled',
                    'description' => 'Daha önce bu eğitime kayıt olunmuştur.'
                ]);
                $basketItem->timestamps = true;
                $basketItem->forceFill(['updated_at' => now()])->save();

                return [
                    'success' => false,
                    'message' => 'Daha önce bu eğitime kayıt olunmuştur.'
                ];
            }

            // --- KAYIT İŞLEMLERİ (BAŞARILI SENARYO) ---

            // Yeni kaydı completed yap
            $basketItem->timestamps = false;
            $basketItem->update([
                'status' => 'completed',
                'description' => 'Ödeme adımı tamamlandı.'
            ]);
            $basketItem->timestamps = true;
            $basketItem->forceFill(['updated_at' => now()])->save();

            // ✅ CourseSessionUser kaydı oluştur veya güncelle
            $courseUser = CourseSessionUser::updateOrCreate(
                [
                    'course_session_id' => $basketItem->course_session_id,
                    'user_id' => $user->id,
                ],
                [
                    'attendance_code' => $attendanceCode,
                    'attendance_status' => 'registered',
                    'is_completed' => false,
                    'registered_at' => now(),
                    'attended_at' => null,
                    'canceled_at' => null,
                    'notes' => 'Ödeme ile kayıt tamamlandı.',
                ]
            );

            SessionUserJoined::dispatch($user, $courseSession);
            // Transaction başarılı bitti, dışarıya verileri dönüyoruz
            return [
                'success' => true,
                'message' => 'Ödeme başarıyla gerçekleştirildi.',
                'basket' => $basketItem,
                'course_session_user' => $courseUser,
                'completed_at' => now()->toDateTimeString(),
            ];

        }); // --- TRANSACTION BİTİŞİ ---


        // -----------------------------------------------------------------------
        // 2. ADIM: EVENT VE YANIT (TRANSACTION DIŞI)
        // -----------------------------------------------------------------------

        // Eğer işlem başarısızsa (basket yoksa, kontenjan dolduysa vs.)
        if ($transactionResult['success'] === false) {
            return response()->json([
                'success' => false,
                'message' => $transactionResult['message'],
            ], 200);
        }

        // Eğer işlem BAŞARILIYSA Event'i burada tetikliyoruz.
        // Veritabanı kesin olarak güncellendi, şimdi herkese haber verebiliriz.
        if ($transactionResult['success'] === true) {

            // Senin orijinal kodundaki veri hazırlama mantığı:
            $minimalData = CourseSession::where('status', 'active')
                ->withCount('users') // users_count'u hesapla
                ->get()
                ->map(function ($session) {
                    return [
                        'id' => $session->id,
                        'users_count' => $session->users_count, // İlişki adı users ise
                        'quota' => $session->quota,
                    ];
                });

            // Event'i fırlat
            SessionQuotaUpdated::dispatch($minimalData);
        }

        // Başarılı yanıtı dön
        return response()->json([
            'success' => true,
            'message' => $transactionResult['message'],
            'basket' => $transactionResult['basket'],
            'course_session_user' => $transactionResult['course_session_user'],
            'completed_at' => $transactionResult['completed_at'],
        ]);
    }




    // Sepetten kaldırma
    public function remove(Request $request)
    {
        $request->validate([
            'course_session_id' => 'required|integer'
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        SessionBasket::where('user_id', $user->id)
            ->where('course_session_id', $request->course_session_id)
            ->delete();

        return response()->json(['message' => 'Sepetten kaldırıldı']);
    }

    // Sepeti temizleme
    public function clear(Request $request)
    {
        $request->validate([
            'basket_id' => 'required|integer',
        ]);

        $user = JWTAuth::parseToken()->authenticate();

        $basket = SessionBasket::where('user_id', $user->id)
            ->where('id', $request->basket_id)
            ->first();

        if (!$basket) {
            return response()->json([
                'success' => false,
                'message' => 'Sepet bulunamadı'
            ]);
        }

        try {
            // Silmek yerine status'u cancelled yapıyoruz
            $basket->timestamps = false; // updated_at değişmesin, istersen true da bırakabilirsin
            $basket->update(['status' => 'cancelled']);
            $basket->timestamps = true;
            $basket->forceFill(['updated_at' => now()])->save();

            return response()->json([
                'success' => true,
                'message' => 'Sepet iptal edildi'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Sepeti iptal ederken hata oluştu'
            ]);
        }
    }


    // Sepeti getirme
    private function getBasket(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $basket = SessionBasket::where('user_id', $user->id)
            ->where('status', 'pending')
            ->with([
                'courseSession.instructor', // Eğitmeni getir
                'courseSession.googleCafe'  // <--- TEK YAPMAN GEREKEN BU SATIRI EKLEMEK
            ])
            ->orderBy('created_at', 'desc')
            ->first();

        return $basket;
    }

}