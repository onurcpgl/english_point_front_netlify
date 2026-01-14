<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InstructorRegisterMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user; // kullanıcı bilgisi

    public function __construct($instructor)
    {
        $this->user = $instructor;
    }

    public function build()
    {
        return $this->subject('English Point | Hoşgeldiniz! 🎉')
            ->view('mail.instructor_registered'); // resources/views/emails/welcome.blade.php
    }
}