<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstructorPasswordReset extends Model
{
    use HasFactory;

    // Hangi alanların toplu atama ile doldurulabileceğini belirtiyoruz
    protected $fillable = [
        'instructor_id',
        'token',
        'used',
    ];

    /**
     * Instructor ile ilişki
     */
    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }
}