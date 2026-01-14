<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseSessionUser extends Model
{
    protected $table = 'course_session_user';

    protected $fillable = [
        'course_session_id',
        'user_id',
        'attendance_status',
        'attendance_code',
        'attendance_code_confirm',
        'is_completed',
        'registered_at',
        'attended_at',
        'canceled_at',
        'notes',
    ];

    // Kullanıcı bilgisi
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Eğitimin bilgisi
    public function courseSession()
    {
        return $this->belongsTo(CourseSession::class);
    }
}