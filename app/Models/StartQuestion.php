<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
/**
 * @OA\Schema(
 *     schema="StartQuestion",
 *     type="object",
 *     title="StartQuestion Model",
 *     required={"id", "question", "options", "correct_answer"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="question", type="string", example="Türkiye'nin başkenti neresidir?"),
 *     @OA\Property(property="options", type="array",
 *         @OA\Items(type="string")
 *     ),
 *     @OA\Property(property="correct_answer", type="array",
 *         @OA\Items(type="string")
 *     ),
 *     @OA\Property(property="question_type", type="string", example="single"),
 * )
 */
class StartQuestion extends Model
{
    use HasTranslations;
    public $translatable = ['question', 'options']; // Hangi alanlar çevrilecek?

    public function courseAnswers()
    {
        return $this->hasMany(CourseSessionAnswer::class);
    }
}