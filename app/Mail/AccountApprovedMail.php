<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user; // kullanıcı bilgisi

    public function __construct($user)
    {
        $this->user = $user;
    }

    public function build()
    {
        return $this->subject('Englihs Point | Hesabınız Onaylandı! 🎉')
            ->view('mail.account-approved'); // resources/views/emails/welcome.blade.php
    }
}