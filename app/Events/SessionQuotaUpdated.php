<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SessionQuotaUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    // Artık burası tek bir sayı değil, eğitimlerin listesi olacak
    public $sessions;

    public function __construct($sessions)
    {
        // Controller'dan gelen tüm listeyi buraya atıyoruz
        $this->sessions = $sessions;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('course_sessions'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'quota.updated';
    }
}