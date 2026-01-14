<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StartQuestionAnswers extends Model
{
    protected $fillable = [
        'uniq_id',
        'answers',
        'who_answered',
    ];
}