<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseSessionAnswer extends Model
{
    protected $fillable = [
        'course_session_id',
        'start_question_id',
        'answer',
    ];

    protected $casts = [
        'answer' => 'array', // JSON olarak kaydedilen cevapları diziye çevir
    ];

    public function courseSession()
    {
        return $this->belongsTo(CourseSession::class);
    }

    public function question()
    {
        return $this->belongsTo(StartQuestion::class, 'start_question_id');
    }
}