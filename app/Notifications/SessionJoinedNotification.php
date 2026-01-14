<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\CourseSession;

class SessionJoinedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $session;

    public function __construct(CourseSession $session)
    {
        $this->session = $session;
    }

    // 1. NERELERE GÖNDERİLECEK?
    public function via(object $notifiable): array
    {
        // Buraya 'database' eklediğin an, veritabanına kayıt başlar.
        // İleride buraya 'vonage' (SMS) de ekleyeceksin.
        return ['mail', 'database'];
    }

    // 2. MAİL AYARLARI (Zaten vardı)
    public function toMail(object $notifiable): MailMessage
    {
        $url = url('/account/my-educations');

        return (new MailMessage)
            ->subject('Eğitim Kaydı Başarılı') // Mailin Konusu
            ->view('mail.session_joined', [
                // Blade dosyasına göndereceğimiz veriler:
                'session' => $this->session,
                'user' => $notifiable, // Kullanıcı bilgisi (Adı vs. için)
                'url' => $url,        // Buton linki
            ]);
    }

    // 3. VERİTABANI (PROFİLDEKİ MESAJLAR) İÇİN AYARLAR
    // Veritabanındaki 'data' sütununa ne yazılacağını burada belirleriz.
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'success', // Frontend'de yeşil renk göstermek için
            'title' => 'Eğitime Katıldınız! 🎉',
            'message' => $this->session->session_title . ' eğitimi için kaydınız başarıyla alındı.',
            'action_url' => '/account/my-educations',
            'icon' => 'check-circle', // İstersen ikon adı tutabilirsin
        ];
    }
}