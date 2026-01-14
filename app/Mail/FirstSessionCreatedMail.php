<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FirstSessionCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $instructor;

    public function __construct($instructor)
    {
        $this->instructor = $instructor;
    }

    public function build()
    {
        return $this->subject('English Point | Your first session — thank you for joining English Point 🎉')
            ->view('mail.first_session_created');
    }
}