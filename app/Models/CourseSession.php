<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Instructor;
use App\Models\Cafe;

class CourseSession extends Model
{
    protected $fillable = [
        'id',
        'instructor_id',
        'program_id',
        'session_title',
        'description',
        'session_date',
        'quota',
        'duration_minutes',
        'session_type',
        'google_cafe_id',
        'language_level',
        'cafe_id',
        'reminder_sent_at',
        'uniq_id',
        'status',
    ];

    protected static function booted()
    {
        static::addGlobalScope('order_by_date', function ($builder) {
            $builder->orderBy('session_date', 'asc');
        });
    }
    public function cafe()
    {
        return $this->belongsTo(Cafe::class);
    }
    public function program()
    {
        return $this->belongsTo(Program::class, 'program_id', 'id');
    }
    // BelongsTo ilişkisi
    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }

    // Öğrencilerle pivot ilişki
    public function users()
    {
        return $this->belongsToMany(User::class, 'course_session_user');
    }
    public function courseSessionsUsers()
    {
        return $this->belongsToMany(CourseSessionUser::class, 'course_session_user');
    }
    public function isFull(): bool
    {
        return $this->users()->count() >= $this->quota;
    }
    public function remainingQuota(): int
    {
        return $this->quota - $this->users()->count();
    }
    public function googleCafe()
    {
        return $this->belongsTo(GoogleCafe::class, 'google_cafe_id', 'id');
    }
    //Kategori eğitim pivot ilişki
    public function answers()
    {
        return $this->hasMany(CourseSessionAnswer::class);
    }

}