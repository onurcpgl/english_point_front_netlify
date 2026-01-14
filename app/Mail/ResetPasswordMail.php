<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $resetLink; // kullanıcı bilgisi
    public $instructor; // kullanıcı bilgisi


    public function __construct($instructor, $resetLink)
    {
        $this->resetLink = $resetLink;
        $this->instructor = $instructor;

    }

    public function build()
    {
        return $this->subject('English Point | Şifre Sıfırlama')
            ->view('mail.reset-password-mail')
            ->with([
                'resetLink' => $this->resetLink,
                'instructor' => $this->instructor,
            ]);
    }
}