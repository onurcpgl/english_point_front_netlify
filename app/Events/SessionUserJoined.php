<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast; // Bunu eklemeyi unutma!
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\CourseSession;

class SessionUserJoined implements ShouldBroadcast // Burası önemli
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $user;
    public $session;

    public function __construct(User $user, CourseSession $session)
    {
        $this->user = $user;
        $this->session = $session;
    }

    // Hangi kanala yayın yapılacak?
    public function broadcastOn(): array
    {
        // Örnek: Herkesin dinlediği genel bir 'sessions' kanalı
        return [
            new Channel('course-sessions'),
        ];
    }

    // (Opsiyonel) Event adı ne olsun? Varsayılan: sınıf adı (OrderShipped)
    public function broadcastAs(): string
    {
        return 'user.joined';
    }
}