<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\CourseSession;

class SessionJoinedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $session;

    public function __construct(User $user, CourseSession $session)
    {
        $this->user = $user;
        $this->session = $session;
    }

    /**
     * 1. MAİLİN KONUSU (SUBJECT) BURADA AYARLANIR
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'English Point | English Point seansına katılımın onaylandı! 🎉',
        );
    }

    /**
     * 2. HANGİ BLADE DOSYASI GİDECEK BURADA AYARLANIR
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.session_joined',
        );
    }

    /**
     * 3. DOSYA EKİ VARSA BURAYA (ŞU AN BOŞ)
     */
    public function attachments(): array
    {
        return [];
    }
}