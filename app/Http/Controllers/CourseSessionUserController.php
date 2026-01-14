<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CourseSession;
use App\Models\CourseSessionUser;
use App\Models\SessionBasket;
use App\Models\CancellationRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\CourseCanceledMail;
class CourseSessionUserController extends Controller
{
    public function userRegisterCourse(Request $request, $courseSessionId)
    {
        $user = $request->user(); // <- burada request üzerinden alıyoruz
        $courseSession = CourseSession::findOrFail($courseSessionId);

        if ($courseSession->isFull()) {
            return response()->json(['message' => 'Kontenjan dolu!'], 400);
        }

        if ($courseSession->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Zaten kayıtlısınız.'], 400);
        }

        $courseSession->users()->attach($user->id);

        return response()->json(['message' => 'Başarıyla kaydoldunuz!']);
    }


    public function userParticipationConfirmation(Request $request)
    {
        // 1. Request'ten gelen verileri ayrıştır
        $inputCode = $request->input('code'); // Manuel girilen kod
        $userData = $request->input('user');  // User objesi

        // Pivot verilerine güvenli erişim (null check yapılabilir)
        $userId = $userData['id'];
        $sessionId = $request->input('course');

        // 2. İlgili pivot kaydını bul
        // Hem user_id hem course_session_id'ye göre eşleşen satırı çekiyoruz
        $pivotRecord = CourseSessionUser::where('user_id', $userId)
            ->where('course_session_id', $sessionId)
            ->first();

        // Kayıt var mı kontrolü
        if (!$pivotRecord) {
            return response()->json([
                'status' => false,
                'message' => 'Bu kullanıcı için kurs kaydı bulunamadı.'
            ], 200);
        }

        // 3. Kod Karşılaştırması
        // Veritabanındaki kod ile gönderilen kodu kıyasla
        if ($pivotRecord->attendance_code == $inputCode) {

            // Kod doğruysa onayı verasdads
            $pivotRecord->attendance_code_confirm = true;
            $pivotRecord->attendance_status = 'attended';
            $pivotRecord->attended_at = Carbon::now();


            $pivotRecord->save();

            return response()->json([
                'status' => true,
                'message' => 'Katılım kodu doğrulandı ve onaylandı.',
                'data' => $pivotRecord // İstersen güncel veriyi dönebilirsin
            ], 200);

        } else {
            // Kod yanlışsa hata dön
            return response()->json([
                'status' => false,
                'message' => 'Girilen kod hatalı. Lütfen kontrol ediniz.'
            ], 200);
        }
    }

    public function userCanceledCourse(Request $request, $courseSessionId)
    {
        $user = $request->user();

        // 1. Kurs ve Kullanıcı Kaydını Bul
        $courseSession = CourseSession::findOrFail($courseSessionId);

        $pivotRecord = CourseSessionUser::where('user_id', $user->id)
            ->where('course_session_id', $courseSessionId)
            ->first();

        if (!$pivotRecord) {
            return response()->json(['status' => false, 'message' => 'Kayıt bulunamadı.'], 200);
        }

        // Zaten işlem yapılmış mı kontrolü
        if ($pivotRecord->attendance_status === 'canceled_by_user') {
            return response()->json(['status' => false, 'message' => 'Zaten iptal edilmiş.'], 200);
        }
        if ($pivotRecord->attendance_status === 'cancellation_requested') {
            return response()->json(['status' => false, 'message' => 'Zaten bekleyen bir iptal talebiniz var.'], 200);
        }

        // 2. Zaman Kontrolü
        $sessionDate = Carbon::parse($courseSession->session_date);
        $now = Carbon::now();

        if ($sessionDate->isPast()) {
            return response()->json(['status' => false, 'message' => 'Geçmiş eğitim iptal edilemez.'], 200);
        }

        // Farkı saat cinsinden al (Negatif çıkmaması için false parametresi)
        $hoursDifference = $now->diffInHours($sessionDate, false);

        // =========================================================
        // DURUM 1: 12 SAATTEN FAZLA VAR (DİREKT İPTAL & İADE)
        // =========================================================
        if ($hoursDifference > 12) {

            // a) Pivot Kaydını Güncelle
            $pivotRecord->attendance_status = 'canceled_by_user';
            $pivotRecord->attendance_code = "null"; // QR kodunu sil
            $pivotRecord->canceled_at = $now;
            $pivotRecord->save();

            SessionBasket::create([
                'user_id' => $user->id,
                'course_session_id' => $courseSessionId,
                'description' => 'Eğitim iptal edildi',
                'status' => 'cancelled'
            ]);
            // b) Kullanıcıya Mail Gönder
            try {
                Mail::to($user->email)->send(new CourseCanceledMail($courseSession, $user));
            } catch (\Exception $e) {
                // Log::error("Mail gönderilemedi: " . $e->getMessage());
            }

            return response()->json([
                'status' => true,
                'message' => 'Eğitim kaydınız başarıyla iptal edildi. Bilgilendirme e-postası gönderildi.',
                'data' => $pivotRecord
            ], 200);
        }

        // =========================================================
        // DURUM 2: 12 SAATTEN AZ VAR (İPTAL TALEBİ & YÖNETİCİ ONAYI)
        // =========================================================
        else {
            // Frontend'den gelen sebebi al
            $reason = $request->input('reason');

            // Sebep kontrolü (Güvenlik)
            if (empty($reason)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Eğitime 12 saatten az kaldığı için bir iptal nedeni belirtmelisiniz.'
                ], 200);
            }

            // a) CancellationRequest Tablosuna Kayıt At
            $newRequest = CancellationRequest::create([
                'user_id' => $user->id,
                'course_session_id' => $courseSessionId,
                'reason' => $reason,
                'status' => 'pending' // Beklemede
            ]);
            // b) Kullanıcıya Mail Gönder
            try {
                Mail::to($user->email)->send(new CourseCanceledMail($courseSession, $user));
            } catch (\Exception $e) {
                // Log::error("Mail gönderilemedi: " . $e->getMessage());
            }

            return response()->json([
                'status' => true,
                'message' => 'İptal talebiniz alındı. Yönetici onayından sonra işlem tamamlanacaktır.',
                'data' => $newRequest
            ], 200);
        }
    }
    public function checkCancelStatus(Request $request, $courseSessionUserId)
    {
        // 1. Giriş yapan kullanıcıyı al
        $user = $request->user();

        // 2. İlgili kaydı bul
        // Hem ID'si tutmalı HEM DE bu kayıt, istek atan kullanıcıya ait olmalı (Güvenlik için)
        $sessionUser = CourseSessionUser::where('id', $courseSessionUserId)
            ->where('user_id', $user->id)
            ->first();

        // Eğer kayıt bulunamazsa veya kullanıcıya ait değilse:
        if (!$sessionUser) {
            return response()->json([
                'can_cancel' => false,
                'message' => 'Kayıt bulunamadı veya işlem yetkiniz yok.'
            ], 404);
        }

        // 3. Durum Kontrolü (attendance_status 'registered' mi?)
        if ($sessionUser->attendance_status === 'registered') {
            // İptal edilebilir durum
            return response()->json([
                'can_cancel' => true,
                'message' => 'İptal işlemi yapılabilir.'
            ], 200);
        } else {
            // Registered değilse (Onaylanmış, tamamlanmış vs.)
            return response()->json([
                'can_cancel' => false,
                'message' => 'Bu eğitimi iptal edemezsiniz. Eğitim onaylanmış veya durumu değişmiş.'
            ], 200); // Frontend'de hata fırlatmaması için 200 OK dönüp, can_cancel false gönderiyoruz.
        }
    }
}