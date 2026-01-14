<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CourseSession;
use App\Notifications\SessionReminderStudentNotification;
use App\Notifications\SessionReminderInstructorNotification;
use App\Notifications\SessionGuidelinesInstructorNotification;
use Illuminate\Support\Facades\Log; // <--- Log Facade'ini ekledik

class SendSessionReminders extends Command
{
    protected $signature = 'session:send-reminders';
    protected $description = 'Başlamasına 1 saat kalan eğitimlere hatırlatma gönderir';

    public function handle()
    {
        $now = now();
        $nextHour = now()->addMinutes(65);

        // Başlangıç Logu
        Log::info("SESSION-REMINDER: İşlem Başlıyor. Sistem Saati: " . $now->format('Y-m-d H:i:s'));

        $sessions = CourseSession::whereBetween('session_date', [$now, $nextHour])
            ->whereNull('reminder_sent_at')
            ->with(['users', 'instructor'])
            ->get();

        if ($sessions->isEmpty()) {
            Log::info("SESSION-REMINDER: Bu aralıkta gönderilecek hatırlatma bulunamadı.");
        } else {
            Log::info("SESSION-REMINDER: BULUNDU! Toplam " . $sessions->count() . " eğitim işlenecek.");

            foreach ($sessions as $session) {
                // İşlenen eğitimi loglayalım
                Log::info("SESSION-REMINDER: İşlenen Eğitim ID: {$session->id} | Başlık: {$session->title}");

                // A. ÖĞRENCİLERE GÖNDERME
                if ($session->users->count() > 0) {
                    foreach ($session->users as $student) {
                        try {
                            $student->notify(new SessionReminderStudentNotification($session));
                            Log::info("   ✓ Öğrenciye gönderildi: " . $student->email);
                        } catch (\Exception $e) {
                            // Hata durumunda Error seviyesinde log tutuyoruz
                            Log::error("   X HATA (Öğrenci - {$student->email}): " . $e->getMessage());
                        }
                    }
                } else {
                    Log::info("   - Bu derse kayıtlı öğrenci yok (ID: {$session->id}).");
                }

                // B. EĞİTMENE GÖNDERME
                if ($session->instructor) {
                    try {
                        // 1. Hatırlatma Maili
                        $session->instructor->notify(new SessionReminderInstructorNotification($session));
                        Log::info("   ✓ Eğitmene hatırlatma gitti.");

                        // 2. Yönerge Maili (HEMEN PEŞİNDEN)
                        // Herhangi bir gecikme yok, kod satırı aşağıya indiği an gönderir.
                        $session->instructor->notify(new SessionGuidelinesInstructorNotification($session));
                        Log::info("   ✓ Eğitmene yönerge maili de gönderildi.");

                    } catch (\Exception $e) {
                        Log::error("   X HATA (Eğitmen): " . $e->getMessage());
                    }
                }

                // C. VERİTABANI İŞARETLEME
                $session->update(['reminder_sent_at' => now()]);
                Log::info("   -> Veritabanı güncellendi ve işaretlendi (ID: {$session->id}).");
            }
        }

        Log::info("SESSION-REMINDER: İşlem Başarıyla Bitti.");
    }
}