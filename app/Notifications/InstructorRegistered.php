<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\InstructorRegisterMail;
class InstructorRegistered extends Notification implements ShouldQueue
{
    use Queueable;

    protected $instructor;

    public function __construct($instructor)
    {
        $this->instructor = $instructor;
    }

    public function via($notifiable)
    {
        return ['mail', 'database']; // mail ve veritabanına kaydet
    }

    public function toMail($notifiable)
    {
        // Kendi Mailable sınıfını döndür
        return (new InstructorRegisterMail($this->instructor))
            ->to($this->instructor->email);

    }


    public function toDatabase($notifiable)
    {
        return [
            'message' => 'Hesabınız başarıyla oluşturuldu.',
            'instructor_id' => $this->instructor->id,
        ];
    }
}