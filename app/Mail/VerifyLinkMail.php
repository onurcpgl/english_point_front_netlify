<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyLinkMail extends Mailable
{
    use Queueable, SerializesModels;

    public $url; // Doğrulama linki

    public function __construct($url)
    {
        $this->url = $url;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'English Point | Hesabını onayla, konuşmaya başla.',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.verify_link', // Blade dosyası
        );
    }
}