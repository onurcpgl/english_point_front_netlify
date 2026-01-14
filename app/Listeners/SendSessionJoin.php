<?php

namespace App\Listeners;

use App\Events\SessionUserJoined;
use App\Mail\SessionJoinedMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Contracts\Queue\ShouldQueue; // Kuyruk için önemli!
use App\Notifications\SessionJoinedNotification;
class SendSessionJoin implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(SessionUserJoined $event)
    {
        // Event içinden gelen kullanıcıya, Event içindeki bilgileri kullanarak mail at
        // Mail::to($event->user->email)->send(
        //     new SessionJoinedMail($event->user, $event->session)
        // );
        $event->user->notify(new SessionJoinedNotification($event->session));
    }
}