<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Mail\ResetPasswordMail;

class UserPasswordResetNotification extends Notification
{
    use Queueable;

    protected $user;
    protected $resetLink;

    public function __construct($user, $resetLink)
    {
        $this->user = $user;
        $this->resetLink = $resetLink;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new ResetPasswordMail($this->user, $this->resetLink))
            ->to($this->user->email);
    }

    public function toDatabase($notifiable)
    {
        return [
            'user_id' => $this->user->id,
            'reset_link' => $this->resetLink,
            'message' => 'Şifre sıfırlama maili gönderildi.',
        ];
    }

    public function toArray($notifiable)
    {
        return [
            'user_id' => $this->user->id,
            'reset_link' => $this->resetLink,
        ];
    }
}