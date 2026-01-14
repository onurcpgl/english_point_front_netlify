<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CourseSession;
use Illuminate\Support\Facades\Log; // Log facade'ini eklemeyi unutma

class AutoCancelEmptySessions extends Command
{
    protected $signature = 'session:auto-cancel';
    protected $description = 'Katılımcısı olmayan ve saati geçmiş eğitimleri sessizce iptal eder.';

    public function handle()
    {
        // 15 Dakika Opsiyonu: Ders saati 18:00 ise, 18:15'e kadar bekler.
        // Eğer hemen iptal olsun istersen ->subMinutes(15) kısmını silip now() yapabilirsin.
        $checkTime = now()->subMinutes(5);

        // Sorguyu hazırla
        $query = CourseSession::where('session_date', '<=', $checkTime)
            ->where('status', 'active')
            ->doesntHave('users');

        // Önce kaç tane olduğunu say
        $count = $query->count();

        if ($count > 0) {
            // Hepsini güncelle
            $query->update(['status' => 'CANCELLED']);

            // Sadece işlem yapıldıysa Log tut
            Log::info("AUTO-CANCEL: {$count} adet boş oturum sistem tarafından iptal edildi.", [
                'time' => now(),
                'criteria' => "{$checkTime} tarihinden önceki boş dersler"
            ]);
        }

        // İşlem yoksa hiçbir şey yapma ve log kirletme.
    }
}