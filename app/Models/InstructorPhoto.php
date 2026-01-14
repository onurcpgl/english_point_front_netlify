<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstructorPhoto extends Model
{
    protected $fillable = [
        'instructor_id',
        'photo_path',
        'is_active',
    ];


}