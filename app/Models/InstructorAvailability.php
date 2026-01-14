<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstructorAvailability extends Model
{
    protected $fillable = [
        'instructor_id',
        'day_of_week',
        'time_from',
        'time_to',
    ];

}