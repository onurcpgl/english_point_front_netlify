<?php
use Illuminate\Support\Facades\Route;

use App\Models\CourseSession;
use Illuminate\Support\Str;
use App\Events\SessionUserJoined;



Route::get('/test-ws', function () {
    SessionUserJoined::dispatch('Selam canım!');
    return 'Event gönderildi.';
});

Route::get('/fix-uniq-ids', function () {
    // 1. Uniq ID'si boş (null) olan veya boş string olanları çekiyoruz
    $sessions = CourseSession::whereNull('uniq_id')
        ->orWhere('uniq_id', '')
        ->get();

    $count = 0;

    foreach ($sessions as $session) {
        // 2. UUID oluşturup atıyoruz
        $session->uniq_id = (string) Str::uuid();

        // save() dediğimizde created_at/updated_at bozulmaz
        $session->saveQuietly(); // Eventleri tetiklemeden (mail vs. gitmesin diye) kaydetmek daha güvenlidir

        $count++;
    }

    return "İşlem Başarılı! Toplam $count adet eğitime uniq_id atandı.";
});

Route::get('/{any?}', function () {
    return view('welcome'); // React view dosyanın adı neyse onu yaz
})->where('any', '^(?!api|admin).*$');