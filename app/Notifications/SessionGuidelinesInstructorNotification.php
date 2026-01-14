<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\CourseSession;

class SessionGuidelinesInstructorNotification extends Notification
{
    use Queueable;

    protected $session;

    public function __construct(CourseSession $session)
    {
        // Konu başlığında ders ismini kullanmak istersen diye session'ı tutuyoruz.
        // Kullanmayacaksan burayı da silebilirsin.
        $this->session = $session;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            // Konu Başlığı (İngilizce)
            ->subject('Action Required: Session Guidelines - ')
            // Blade dosyasının yolu (resources/views/mails/session-guidelines.blade.php olmalı)
            // İkinci parametre (array) silindi, veri gönderilmiyor.
            ->view('mail.session-guidelines');
    }
}