<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue; // Kuyruk için önemli
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

// ShouldQueue ekleyerek mailin arka planda gönderilmesini sağla (API hızını etkilemez)
class SessionCompletedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $session;
    public $instructor;
    public $amount;

    /**
     * Create a new message instance.
     */
    public function __construct($session, $instructor, $amount)
    {
        $this->session = $session;
        $this->instructor = $instructor;
        $this->amount = $amount;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Session completed! Your payment is on the way 💸')
            ->view('mail.session_completed'); // Birazdan oluşturacağız
    }
}