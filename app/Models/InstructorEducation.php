<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstructorEducation extends Model
{
    protected $table = 'instructor_educations';
    protected $fillable = [
        'instructor_id',
        'university',
        'degree',
        'degree_type',
        'specialization',
        'years_of_study',
        'diploma_file_path',
    ];

}