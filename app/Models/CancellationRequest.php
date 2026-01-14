<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CancellationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_session_id',
        'reason',
        'status',
        'admin_note'
    ];

    // İlişkiler
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function courseSession()
    {
        return $this->belongsTo(CourseSession::class);
    }
}