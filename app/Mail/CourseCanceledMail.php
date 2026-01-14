<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\CourseSession;
use App\Models\User;

class CourseCanceledMail extends Mailable
{
    use Queueable, SerializesModels;

    public $courseSession;
    public $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(CourseSession $courseSession, User $user)
    {
        $this->courseSession = $courseSession;
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('English Point | İptal talebin alındı ✔️')
            ->view('mail.course_canceled'); // Birazdan bu view dosyasını oluşturacağız
    }
}