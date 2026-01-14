<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CourseSession;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\SessionActivatedMail; // Oluşturduğumuz mail sınıfı

class ActivateCourseSessions extends Command
{
    protected $signature = 'course:activate-sessions';
    protected $description = '30 dakikayı geçen awaiting durumundaki eğitimleri active yapar ve mail atar.';

    public function handle()
    {
        $timeLimit = Carbon::now()->subMinutes(30);

        // 1. Önce güncellenecek olanları 'instructor' (eğitmen) ilişkisiyle beraber çekiyoruz.
        // Not: Modelinizde eğitmene giden ilişki adı 'user' veya 'teacher' ise 'instructor' kısmını ona göre düzeltin.
        $sessions = CourseSession::with('instructor')
            ->where('status', 'awaiting')
            ->where('created_at', '<=', $timeLimit)
            ->get();

        if ($sessions->isEmpty()) {
            $this->info("Güncellenecek uygun eğitim bulunamadı.");
            return 0;
        }

        $count = 0;

        foreach ($sessions as $session) {
            // 2. Durumu güncelle
            $session->update(['status' => 'active']);

            // 3. Eğitmene mail gönder
            // Eğitmen ilişkisinin ve email'in var olduğundan emin olalım
            if ($session->instructor && $session->instructor->email) {
                Mail::to($session->instructor->email)
                    ->send(new SessionActivatedMail($session));
            }

            $count++;
            $this->info("ID: {$session->id} aktif edildi ve mail gönderildi.");
        }

        $this->info("Toplam $count adet eğitim active olarak güncellendi.");
        return 0;
    }
}