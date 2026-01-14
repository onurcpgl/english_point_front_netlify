<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstructorPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'instructor_id',
        'course_session_id',
        'amount',
        'currency',
        'status',
        'paid_at',
        'transaction_id',
        'note'
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount' => 'decimal:2' // Laravel'in bunu sayı olarak görmesini sağlar
    ];

    // İlişki: Ödeme kime ait?
    public function instructor()
    {
        return $this->belongsTo(Instructor::class, 'instructor_id');
    }

    // İlişki: Hangi dersin ödemesi?
    public function session()
    {
        return $this->belongsTo(CourseSession::class, 'course_session_id');
    }
}