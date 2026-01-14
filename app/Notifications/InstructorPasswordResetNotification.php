<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Mail\ResetPasswordMail;
use App\Mail\InstructorRegisterMail;

use Illuminate\Contracts\Queue\ShouldQueue;

class InstructorPasswordResetNotification extends Notification
{
    use Queueable;


    protected $instructor;
    protected $resetLink;


    public function __construct($instructor, $resetLink)
    {
        $this->instructor = $instructor;
        $this->resetLink = $resetLink;

    }

    public function via($notifiable)
    {
        return ['mail', 'database']; // hem mail hem de database kanalı
    }

    // Mail gönderimi
    public function toMail($notifiable)
    {
        return (new ResetPasswordMail($this->instructor, $this->resetLink))
            ->to($this->instructor->email);
    }

    // Database kanalında kaydedilecek veri
    public function toDatabase($notifiable)
    {
        return [
            'instructor_id' => $this->instructor->id,
            'reset_link' => $this->resetLink,
            'message' => 'Şifre sıfırlama maili gönderildi.',
        ];
    }

    // Opsiyonel: toArray() metodu bazı durumlarda kullanışlı olabilir
    public function toArray($notifiable)
    {
        return [
            'instructor_id' => $this->instructor->id,
            'reset_link' => $this->resetLink,
        ];
    }
}