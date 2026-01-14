<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SessionBasket extends Model
{
    protected $fillable = [
        'user_id',
        'course_session_id',
        'items',
        'status',
        'description',
    ];
    public function courseSession()
    {
        return $this->belongsTo(CourseSession::class);
    }

}