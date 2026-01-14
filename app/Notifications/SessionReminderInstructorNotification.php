<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SessionReminderInstructorNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public $session;

    public function __construct($session)
    {
        $this->session = $session;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('🚀 Class Reminder! 1 Hour Left')
            ->view('mail.reminder_instructor', [
                'user' => $notifiable,
                'session' => $this->session,
                'url' => url('/instructor/session/')
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'warning',
            'title' => 'Upcoming Class Reminder 🚀',
            'message' => "Instructor, there is only 1 hour left for the class: {$this->session->session_title}!",
            'action_url' => '/instructor/session/',
            'icon' => 'zap'
        ];
    }
}