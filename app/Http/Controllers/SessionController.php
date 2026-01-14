<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\CourseSession;
use Illuminate\Support\Str;
use App\Models\GoogleCafe;
use App\Models\InstructorPayment;
use App\Models\Program;
use App\Models\CourseSessionUser;
use Illuminate\Support\Facades\Auth;
use App\Mail\SessionCompletedMail;
use App\Models\CourseSessionAnswer;
use Illuminate\Support\Facades\Mail;
use App\Mail\FirstSessionCreatedMail;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
class SessionController extends Controller
{
    public function getCourseSessions()
    {
        $sessions = CourseSession::with(['instructor', 'googleCafe', 'answers', 'instructor.educations', 'program.category'])
            ->where('status', 'active')
            ->where('session_date', '>=', now())
            ->orderBy('session_date', 'asc')
            ->get();

        $sessions->each(function ($session) {
            $activePhoto = $session->instructor?->photos()
                ->where('is_active', 1)
                ->latest()
                ->first();

            $session->instructor->photo_url = $activePhoto
                ? url('storage/' . $activePhoto->photo_path)
                : null;

            unset($session->instructor->photos); // istersen photos array’ini gizle
        });

        return response()->json($sessions);
    }
    public function getCourseSessionsById($id)
    {
        $sessions = CourseSession::with(['instructor', 'googleCafe', 'answers', 'instructor.educations', 'program.category'])
            ->where('instructor_id', $id)
            ->where('status', 'active')
            // EKLENEN KURAL 1: Sadece bugünden sonraki veya bugünkü oturumları getir
            ->where('session_date', '>=', now())
            // EKLENEN KURAL 2: Tarihe göre yakından uzağa sırala
            ->orderBy('session_date', 'asc')
            ->get();

        if ($sessions->isEmpty()) {
            return response()->json(['message' => 'Kayıt bulunamadı'], 200);
        }

        $sessions->transform(function ($session) {
            if ($session->instructor) {
                // Eğitmenin aktif fotoğrafını bul
                $activePhoto = $session->instructor->photos()
                    ->where('is_active', 1)
                    ->latest()
                    ->first();

                // URL oluştur
                $session->instructor->photo_url = $activePhoto
                    ? url('storage/' . $activePhoto->photo_path)
                    : null;

                // Photos ilişkisini gizle (isteğe bağlı)
                unset($session->instructor->photos);
            }

            return $session;
        });

        return response()->json($sessions);
    }
    public function getCourseSessionSingle($id)
    {
        // 1. Tek bir oturumu ID'ye ve kurallara göre çekiyoruz
        $session = CourseSession::with(['instructor', 'googleCafe', 'answers', 'instructor.educations', 'program.category'])
            ->where('uniq_id', $id)                   // İstenen ID
            ->where('status', 'active')          // Aktiflik kuralı
            ->where('session_date', '>=', now()) // Tarih kuralı (Geçmiş oturumları getirme)
            ->first();                           // List değil, tek kayıt (obje) döner

        // 2. Kayıt yoksa hata döndür
        if (!$session) {
            return response()->json(['status' => false, 'message' => 'Aradığınız eğitimin süresi sona ermiştir. Dilerseniz diğer eğitimlerimizi inceleyebilirsiniz.'], 200);
        }

        // 3. Tek bir kayıt olduğu için döngüye (transform/each) gerek yok, doğrudan işliyoruz
        if ($session->instructor) {
            $activePhoto = $session->instructor->photos()
                ->where('is_active', 1)
                ->latest()
                ->first();

            $session->instructor->photo_url = $activePhoto
                ? url('storage/' . $activePhoto->photo_path)
                : null;

            // İlişkiyi gizle (isteğe bağlı)
            unset($session->instructor->photos);
        }

        return response()->json(['status' => true, 'message' => 'Kayıt bulundu.', 'data' => $session], 200);
    }
    public function getCourseSessionQuotaInfo()
    {
        // 1. Eğitmen kontrolü
        $instructor = auth('instructor')->user();

        if ($instructor) {
            // Eğitmenin kendi dersleri
            $query = $instructor->courseSessions()
                ->whereIn('status', ['active', 'completed']);
        } else {
            // Admin veya misafir için tüm aktif dersler
            $query = CourseSession::where('status', 'active');
        }

        // 2. KOTA HESAPLAMA (DÜZELTME BURADA)
        // withCount içine bir array ve fonksiyon tanımlayarak filtre uyguluyoruz.
        $data = $query->withCount([
            'users' => function ($query) {

                // BURASI ÇOK ÖNEMLİ:
                // Sadece bu statüdekileri sayaca, 'canceled' olanları saymayacak.
                // Pivot tablosunun adını belirterek sütunu seçiyoruz.
                // 'attended' verisini de ekledim çünkü derse giren de kotadan yer.'
                $query->whereIn('course_session_user.attendance_status', ['registered', 'completed', 'attended', 'no_show', 'instructor_absent']);

            }
        ])
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'session_title' => $session->session_title, // Modelinde name değil session_title vardı, düzelttim.
                    'users_count' => $session->users_count, // Artık filtrelenmiş net sayı
                    'quota' => $session->quota,
                    // Frontend'de işine yarar diye kalan kotayı da ekledim:
                    'remaining_quota' => $session->quota - $session->users_count,
                    'status' => $session->status,
                ];
            });

        return response()->json($data);
    }

    // public function store(Request $request)
    // {
    //     // 1. Manuel Validasyon (Status: false döndürebilmek için)
    //     $validator = Validator::make($request->all(), [
    //         'program_id' => 'required|exists:programs,id', // Program ID zorunlu
    //         'cafe_id' => 'nullable|exists:cafes,id',
    //         'session_date' => 'required|date',
    //         'language_level' => 'required|string|max:50',
    //         'start_answers' => 'required|array',
    //         // session_title, description, duration, quota inputları kalktı
    //     ]);

    //     // Validasyon başarısızsa özel formatta hata dön
    //     if ($validator->fails()) {
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Please check all fields.',
    //             'errors' => $validator->errors()
    //         ], status: 200);
    //     }

    //     try {
    //         // 2. Yetkilendirme Kontrolü
    //         $instructor = JWTAuth::parseToken()->authenticate();
    //         if (!$instructor) {
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'Your session has expired, please log in again.'
    //             ], 401);
    //         }

    //         // 3. Seçilen Programı Bul
    //         $program = Program::findOrFail($request->program_id);

    //         // 4. Session Verisini Hazırla
    //         // Kullanıcıdan gelmeyen verileri Program'dan dolduruyoruz.
    //         $sessionData = [
    //             'instructor_id' => $instructor->id,
    //             'program_id' => $program->id,         // İlişki için ID
    //             'cafe_id' => $request->cafe_id,
    //             'session_date' => $request->session_date,
    //             'language_level' => $request->language_level,

    //             // Programdan Kopyalananlar:
    //             // Not: Program modelindeki title/description JSON (Spatie Translatable) ise
    //             // veritabanına da JSON olarak kaydedilir. Sorun olmaz.
    //             'session_title' => $program->getTranslation('title', 'en'),
    //             'description' => $program->getTranslation('description', 'en'),
    //             'duration_minutes' => $program->duration_minutes,

    //             // Input kalktığı için varsayılan bir kota belirlemeliyiz 
    //             // veya migration'da bu alana default(1) vermeliydik.
    //             // Şimdilik kod tarafında sabit veriyoruz:
    //             'quota' => 6,
    //             'status' => 'awaiting' // Varsayılan olarak aktif
    //         ];

    //         // 5. Kayıt İşlemi
    //         $session = CourseSession::create($sessionData);

    //         // 6. Başlangıç Sorularını Kaydet
    //         if (!empty($request->start_answers)) {
    //             foreach ($request->start_answers as $questionId => $answer) {
    //                 CourseSessionAnswer::create([
    //                     'course_session_id' => $session->id,
    //                     'start_question_id' => $questionId,
    //                     'answer' => $answer,
    //                 ]);
    //             }
    //         }

    //         // 7. Başarılı Yanıt
    //         return response()->json([
    //             'status' => true,
    //             'message' => 'Session created successfully.',
    //             'data' => $session
    //         ], 200);

    //     } catch (\Exception $e) {
    //         // Genel sunucu hataları
    //         return response()->json([
    //             'status' => false,
    //             'message' => 'Server error: ' . $e->getMessage()
    //         ], 200);
    //     }
    // }
    public function store(Request $request)
    {
        // 1. VALIDASYON
        $validator = Validator::make($request->all(), [
            'program_id' => 'required|exists:programs,id',
            'session_date' => 'required|date',
            'language_level' => 'required|string|max:50',
            'google_cafe' => 'required|array',
            'sub_category_id' => 'required|string',
            'google_cafe.google_place_id' => 'required|string',
            'google_cafe.district' => 'required|string',
            'google_cafe.city' => 'required|string',
            'google_cafe.name' => 'required|string',
            'google_cafe.latitude' => 'required|numeric',
            'google_cafe.longitude' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Lütfen tüm alanları kontrol ediniz.',
                'errors' => $validator->errors()
            ], 200);
        }

        try {
            // 2. YETKİLENDİRME
            $instructor = JWTAuth::parseToken()->authenticate();
            if (!$instructor) {
                return response()->json(['status' => false, 'message' => 'Unauthorized'], 401);
            }

            // 3. PROGRAMI BUL
            $program = Program::findOrFail($request->program_id);

            // 4. GOOGLE CAFE KAYDI
            $gData = $request->google_cafe;
            $savedGoogleCafe = GoogleCafe::updateOrCreate(
                ['google_place_id' => $gData['google_place_id']],
                [
                    'name' => $gData['name'],
                    'district' => $gData['district'],
                    'city' => $gData['city'],
                    'map_url' => $gData['map_url'],
                    'address' => $gData['address'] ?? null,
                    'latitude' => $gData['latitude'],
                    'longitude' => $gData['longitude'],
                    'image' => "https://api.englishpoint.com.tr/public/google_cafe/google_cafe_image.jpg",
                ]
            );

            // 5. SESSION OLUŞTURMA
            $sessionData = [
                'instructor_id' => $instructor->id,
                'program_id' => $program->id,
                'cafe_id' => null,
                'business_slug' => $request->sub_category_id,
                'google_cafe_id' => $savedGoogleCafe->id,
                'session_date' => $request->session_date,
                'language_level' => $request->language_level,
                'session_title' => $program->title,
                'description' => $program->description,
                'duration_minutes' => $program->duration_minutes,
                'uniq_id' => Str::uuid(),
                'quota' => 6,
                'status' => 'awaiting'
            ];

            $session = CourseSession::create($sessionData);

            // --- YENİ EKLENEN KISIM: İLK EĞİTİM KONTROLÜ VE MAİL ---
            // Eğitmenin toplam eğitim sayısını sayıyoruz
            $totalSessions = CourseSession::where('instructor_id', $instructor->id)->count();

            // Eğer toplam sayı 1 ise, bu az önce oluşturduğumuz eğitim ilktir.
            if ($totalSessions === 1 && $instructor->email) {
                // Mail gönderme işlemi
                // try-catch içine alıyoruz ki mail hatası verirse response bozulmasın
                try {
                    Mail::to($instructor->email)->send(new FirstSessionCreatedMail($instructor));
                } catch (\Exception $mailEx) {
                    // Mail gönderilemezse loglanabilir, ama akışı bozmayalım.
                    // Log::error("Mail atılamadı: " . $mailEx->getMessage());
                }
            }
            // -------------------------------------------------------

            // 6. CEVAPLARI KAYDET (Yorum satırındaydı, dokunmadım)

            return response()->json([
                'status' => true,
                'message' => 'Session created successfully.',
                'data' => $session
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Server error: ' . $e->getMessage()
            ], 200);
        }
    }
    public function getSessionUsers($id)
    {
        try {
            // 1. Token kontrolü
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // 2. VERİTABANINDAN TÜM BAĞLI KAYITLARI ÇEK
            // first() yerine get() kullanıyoruz ki o ID'ye bağlı ne kadar kayıt varsa gelsin.
            // Ayrıca iptal edilenleri görmek istemezsen whereIn kısmını aktif bırakabilirsin.
            $participants = CourseSessionUser::where('course_session_id', $id)
                // Resimdeki "attendance_status" sütununa göre filtreleme (İsteğe bağlı, hepsini istersen bu satırı sil)
                ->whereIn('attendance_status', ['registered', 'attended', 'completed', 'no_show', 'instructor_absent'])
                ->with('user') // İlişkili User bilgisini de çek
                ->get();


            // 3. Kayıt var mı kontrolü
            if ($participants->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'No participants found for this session'
                ], 200); // veya boş array dönebilirsin: return response()->json([], 200);
            }

            // 4. TRANSFORM İŞLEMİ (User objesini çıkarıp temizleme)
            // Elimizde şu an "CourseSessionUser" satırları var. İçindeki "User"ı çekip düzenleyeceğiz.
            $formattedUsers = $participants->map(function ($record) {

                // $record -> Resimdeki her bir satırdır (Örn: ID 60, 61 vs.)
                // $record->user -> O satırdaki user_id'ye karşılık gelen kullanıcı
                $userItem = $record->user;

                // Eğer user silinmişse işlemi atla
                if (!$userItem)
                    return null;

                // Resim URL işlemi
                if ($userItem->profile_image) {
                    $userItem->profile_image = asset('storage/' . $userItem->profile_image);
                }

                // RESİMDEKİ SÜTUNLARI USER OBJESİNE EKLEME
                // Tablondaki verileri user objesinin içine kopyalıyoruz
                $userItem->attendance_status = $record->attendance_status;         // registered, completed vs.
                $userItem->attendance_code_confirm = $record->attendance_code_confirm; // 0 veya 1
                $userItem->is_completed = $record->is_completed;                   // 0 veya 1
                $userItem->registered_at = $record->registered_at;                 // Kayıt tarihi

                // İstersen ana kayıt id'sini de ekleyebilirsin (Tablodaki en baştaki ID)
                $userItem->participation_id = $record->id;

                return $userItem;

            })->filter()->values(); // Silinen user varsa listeden temizle ve indexleri düzelt

            // 5. Listeyi döndür
            return response()->json($formattedUsers, 200);

        } catch (JWTException $e) {
            return response()->json(['message' => 'Token invalid or expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request)
    {
        // 1. ID ALMA
        $id = $request->input('course_session_id');

        // 2. VALIDASYON (Update için gelen veriye uygun)
        $validator = Validator::make($request->all(), [
            'course_session_id' => 'required|integer|exists:course_sessions,id',
            'program_id' => 'required|exists:programs,id',
            'session_date' => 'required',
            'language_level' => 'required|string|max:50',

            // Google Cafe
            'google_cafe' => 'required|array',
            'google_cafe.google_place_id' => 'required|string',
            'google_cafe.name' => 'required|string',
            'google_cafe.district' => 'required|string',
            'google_cafe.city' => 'required|string',
            'google_cafe.latitude' => 'required|numeric', // Frontend'den latitude geliyor
            'google_cafe.longitude' => 'required|numeric', // Frontend'den longitude geliyor
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Lütfen alanları kontrol ediniz.',
                'errors' => $validator->errors()
            ], 200);
        }

        try {
            $instructor = JWTAuth::parseToken()->authenticate();
            $session = CourseSession::where('instructor_id', $instructor->id)->find($id);

            if (!$session) {
                return response()->json(['status' => false, 'message' => 'Oturum bulunamadı.'], 200);
            }

            // ---------------------------------------------------------
            // 3. PROGRAM VE BAŞLIK AYARI (Store fonksiyonundaki mantık)
            // ---------------------------------------------------------
            $program = Program::findOrFail($request->program_id);

            // Eğer modelinde 'getTranslation' varsa:
            // $sessionTitle = $program->getTranslation('title', 'en'); 

            // Eğer 'getTranslation' hata verirse veya manuel JSON ise güvenli yöntem:
            $sessionTitle = $program->title;


            // ---------------------------------------------------------
            // 4. GOOGLE CAFE MANTIĞI
            // ---------------------------------------------------------
            $gData = $request->google_cafe;

            // "firstOrCreate": Varsa getir, yoksa oluştur. 
            // (Böylece var olan bir cafenin adresini yanlışlıkla değiştirmezsin)
            $cafe = GoogleCafe::firstOrCreate(
                ['google_place_id' => $gData['google_place_id']],
                [
                    'name' => $gData['name'],
                    'map_url' => $gData['map_url'],
                    'district' => $gData['district'],
                    'city' => $gData['city'],
                    'address' => $gData['address'] ?? null,
                    'latitude' => $gData['latitude'],
                    'longitude' => $gData['longitude'],
                    'image' => "https://api.englishpoint.com.tr/public/google_cafe/google_cafe_image.jpg",
                ]
            );

            // ---------------------------------------------------------
            // 5. SESSION GÜNCELLEME
            // ---------------------------------------------------------
            $formattedDate = Carbon::parse($request->session_date)
                ->setTimezone(config('app.timezone'))
                ->format('Y-m-d H:i:s');

            $session->update([
                'program_id' => $program->id,
                'session_title' => $sessionTitle, // 🔥 Store'daki gibi programdan aldık
                'description' => $program->description['en'] ?? $program->description, // Store'da bu da vardı, eklemek mantıklı

                'google_cafe_id' => $cafe->id, // Yeni/Mevcut Cafe ID
                'session_date' => $formattedDate,
                'language_level' => $request->language_level,
            ]);

            // // 6. CEVAPLARI GÜNCELLEME
            // if ($request->has('start_answers') && !empty($request->start_answers)) {
            //     CourseSessionAnswer::where('course_session_id', $session->id)->delete();
            //     foreach ($request->start_answers as $questionId => $answer) {
            //         $ansVal = is_array($answer) ? json_encode($answer) : $answer;
            //         CourseSessionAnswer::create([
            //             'course_session_id' => $session->id,
            //             'start_question_id' => $questionId,
            //             'answer' => $ansVal,
            //         ]);
            //     }
            // }

            return response()->json([
                'status' => true,
                'message' => 'Session updated successfully.',
                // İlişkileri yükleyip döndür
                'data' => $session->refresh()->load(['googleCafe'])
            ], 200);

        } catch (\Exception $e) {
            Log::error("Session Update Error: " . $e->getMessage());
            return response()->json(['status' => false, 'message' => $e->getMessage()], 200);
        }
    }
    public function destroy($id)
    {
        try {
            $instructor = JWTAuth::parseToken()->authenticate();

            // 1. Find the session and ensure security (Does it belong to this instructor?)
            $session = CourseSession::where('instructor_id', $instructor->id)->findOrFail($id);

            // 2. Status Check: Only sessions with 'awaiting' status can be deleted
            if ($session->status !== 'awaiting') {
                return response()->json([
                    'status' => false,
                    'message' => 'Only sessions in "awaiting" status can be deleted.'
                ], 200);
            }

            // 3. Participant Check: Are there any registered students?
            if ($session->users_count > 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'You cannot delete a session that has registered participants.'
                ], 200);
            }

            // 4. Deletion Process (Updating status to 'deleted')
            $session->update([
                'status' => 'deleted'
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Session deleted successfully.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Deletion error: ' . $e->getMessage()
            ], 200);
        }
    }

    public function sessionCompleted(Request $request, $id)
    {
        return DB::transaction(function () use ($request, $id) {
            try {
                // 1. Yetki Kontrolü
                $instructor = JWTAuth::parseToken()->authenticate();
                if (!$instructor) {
                    return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
                }

                // 2. Session'ı bul
                $session = CourseSession::where('id', $id)
                    ->where('instructor_id', $instructor->id)
                    ->first();

                if (!$session) {
                    return response()->json(['success' => false, 'message' => 'Session not found.'], 200);
                }

                if ($session->status === 'completed') {
                    return response()->json([
                        'success' => true,
                        'message' => 'Session is already marked as completed.',
                        'data' => $session
                    ], 200);
                }

                // --- ÖĞRENCİ ANALİZİ VE GÜNCELLEME ---

                // ADIM A: ÖDEMEYE DAHİL EDİLECEK (ONAYLI) ÖĞRENCİ SAYISI
                // Sadece 'attendance_code_confirm' = 1 olanları sayıyoruz.
                // Not: İptal edenleri (canceled) zaten confirm 1 yapmayacağın için otomatik elenirler.

                $allSessionUsers = CourseSessionUser::where('course_session_id', $session->id)
                    ->whereIn('attendance_status', ['registered', 'attended'])
                    ->get();
                $confirmedStudentCount = $allSessionUsers->where('attendance_code_confirm', 1)->count();

                // 2. Kodu Okunmamış (Unconfirmed) Olanları Say
                // Toplam sayıdan onaylıları çıkararak veya direkt filtreleyerek bulabiliriz.
                $unconfirmedStudentCount = $allSessionUsers->where('attendance_code_confirm', '!=', 1)->count();
                // ADIM B: FİYATLANDIRMA (Sadece onaylı sayıya göre)

                $basePayment = 0.00;

                if ($confirmedStudentCount == 1) {
                    $basePayment = 200.00;
                } elseif ($confirmedStudentCount == 2) {
                    $basePayment = 250.00;
                } elseif ($confirmedStudentCount == 3) {
                    $basePayment = 300.00;
                } elseif ($confirmedStudentCount == 4) {
                    $basePayment = 400.00;
                } elseif ($confirmedStudentCount == 5) {
                    $basePayment = 500.00;
                } elseif ($confirmedStudentCount >= 6) {
                    $basePayment = 600.00;
                }

                $extraPayment = $unconfirmedStudentCount * 100.00;
                $paymentAmount = $basePayment + $extraPayment;
                // ADIM C: STATÜ GÜNCELLEMELERİ

                // 1. DURUM: Kodu onaylı olanları 'completed' yap
                CourseSessionUser::where('course_session_id', $session->id)
                    ->where('attendance_code_confirm', 1)
                    ->update(['attendance_status' => 'completed']);

                // 2. DURUM: Kodu ONAYSIZ (False) olanları 'instructor_absent' yap
                // DİKKAT: Burada 'canceled_by_user' olanlara dokunmamalıyız, adam zaten iptal etmiş.
                // Sadece hala listede görünüp (registered) kodu onaylanmayanları işaretliyoruz.
                CourseSessionUser::where('course_session_id', $session->id)
                    ->where('attendance_code_confirm', 0) // Kodu onaylanmamış
                    ->whereIn('attendance_status', ['registered', 'attended']) // Ama hala listede
                    ->update(['attendance_status' => 'no_show']); // İsteğin üzerine bu statüye çekiyoruz

                // --- DİĞER İŞLEMLER ---

                // Session'ı kapat
                $session->status = 'completed';
                $session->save();

                // Ödeme kaydını oluştur
                InstructorPayment::create([
                    'instructor_id' => $instructor->id,
                    'course_session_id' => $session->id,
                    'amount' => $paymentAmount,
                    'currency' => 'TRY',
                    'status' => 'pending',
                    'paid_at' => null,
                    'transaction_id' => null,
                    'note' => "Session completed. Confirmed students: {$confirmedStudentCount}. Unconfirmed marked as absent.",
                ]);

                // Mail Gönderimi
                try {
                    Mail::to($instructor->email)->send(new SessionCompletedMail($session, $instructor, $paymentAmount));
                } catch (\Exception $mailEx) {
                    // Log::error("Mail error: " . $mailEx->getMessage());
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Session completed successfully.',
                    'data' => [
                        'session_status' => $session->status,
                        'confirmed_students' => $confirmedStudentCount,
                        'payment_amount' => $paymentAmount . ' TRY'
                    ]
                ], 200);

            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'System error: ' . $e->getMessage()
                ], 500);
            }
        });
    }
}