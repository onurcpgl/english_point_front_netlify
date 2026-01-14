<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SessionReminderStudentNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public $session;

    public function __construct($session)
    {
        $this->session = $session;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database']; // Hem mail hem panel mesajı
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('⏳ Eğitiminiz 1 Saat Sonra Başlıyor!')
            ->view('mail.reminder_student', [
                'user' => $notifiable,
                'session' => $this->session,
                'url' => url('/account/my-session')
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'info',
            'title' => 'Eğitim Yaklaşıyor ⏰',
            'message' => "{$this->session->session_title} eğitimi 1 saat sonra başlıyor.",
            'action_url' => '/account/my-session',
            'icon' => 'clock'
        ];
    }
}