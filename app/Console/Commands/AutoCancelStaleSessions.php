<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\CourseSession;
use Illuminate\Support\Facades\Log;

class AutoCancelStaleSessions extends Command
{
    // Komutun adı
    protected $signature = 'session:auto-cancel-stale';

    // Açıklaması
    protected $description = 'Eğitmeni tarafından sonlandırılmamış, günü geçmiş (24 saat) dersleri otomatik iptal eder.';

    public function handle()
    {
        // 1. ZAMAN AYARI: Şu andan 24 saat gerisi (Dün bu saatler)
        // Yani ders biteli 1 gün olmuş ama hala açık.
        $checkTime = now()->subHours(24);

        // 2. LOG BAŞLANGIÇ
        Log::info("STALE-CLEANUP: Unutulmuş ders kontrolü başladı. (Sınır: $checkTime)");

        // 3. SORGU
        // Tarihi 24 saati geçmiş + Durumu hala 'active' + İÇİNDE ÖĞRENCİ OLAN
        $query = CourseSession::where('session_date', '<=', $checkTime)
            ->where('status', 'active')
            ->has('users'); // <--- BURASI ÇOK ÖNEMLİ: Sadece öğrencisi olanlara bakıyoruz.

        $count = $query->count();

        if ($count > 0) {
            // Hepsini İPTAL ET (İlerde tamamlandı yapmak istersen 'COMPLETED' yaz)
            $query->update(['status' => 'CANCELLED']);

            Log::info("STALE-CLEANUP: {$count} adet unutulmuş ders sistem tarafından kapatıldı/iptal edildi.");
            $this->info("{$count} adet unutulmuş ders kapatıldı.");
        } else {
            Log::info("STALE-CLEANUP: Kapatılacak unutulmuş ders bulunamadı.");
        }
    }
}