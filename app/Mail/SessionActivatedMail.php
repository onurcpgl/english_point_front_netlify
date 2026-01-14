<?php

namespace App\Mail;

use App\Models\CourseSession;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SessionActivatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $session;

    // Veriyi buraya alıyoruz
    public function __construct(CourseSession $session)
    {
        $this->session = $session;
    }

    public function build()
    {
        return $this->subject('English Point | Your English Point session is live 🎉')
            ->view('mail.session_activated'); // Blade dosyası yolu
    }
}