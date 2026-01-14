<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;

    public function __construct($name)
    {
        $this->name = $name;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'English Point Ailesine Hoşgeldiniz! 🎉', // Konu başlığı
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.welcome', // Blade dosyamızın yolu
        );
    }
}