<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InstructorLanguage extends Model
{
    protected $fillable = ['instructor_id', 'language', 'level'];

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }
}