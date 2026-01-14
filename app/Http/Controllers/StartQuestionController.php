<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StartQuestion; // Assuming you have a Question model
use Illuminate\Support\Str;
use App\Models\StartQuestionAnswers; // Ensure the model is imported correctly

class StartQuestionController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/get-start-questions",
     *     operationId="getStartQuestions",
     *     tags={"StartQuestions"},
     *     summary="Start sorularını listeler",
     *     description="Tüm başlangıç sorularını JSON olarak döner",
     *     @OA\Response(
     *         response=200,
     *         description="Başarılı işlem",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="question",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/StartQuestion")
     *             )
     *         )
     *     )
     * )
     */
    public function getStartQuestions()
    {
        $startQuestions = StartQuestion::get();

        return response()->json($startQuestions, 200);
    }
    public function getByStartQuestionsAnswers($uniq_id)
    {
        $startQuestions = StartQuestionAnswers::where('uniq_id', $uniq_id)->first();

        return response()->json($startQuestions, 200);
    }
    public function saveQuestionAnswers(Request $request)
    {
        // Validate the request data
        $request->validate([
            'answers' => 'required|array',
            // GÜNCELLEME: 'question' artık {tr:..., en:...} şeklinde bir obje (PHP'de dizi) olarak geliyor.
            // Bu yüzden kuralı 'string' yerine 'array' olarak değiştiriyoruz.
            'answers.*.question' => 'required|array',
            // Opsiyonel: İçindeki dil değerlerinin de metin olduğundan emin olmak için:
            'answers.*.question.*' => 'string',
            'answers.*.answers' => 'required',
        ]);

        $uniq_code = (string) Str::uuid();

        if ($request->input('user')) {
            $who_answered = $request->input('user');
        } else {
            $who_answered = null;
        }

        // Buradaki json_encode işlemi yeni yapıyı da sorunsuz şekilde veritabanına kaydedecektir.
        $data = [
            'uniq_id' => $uniq_code,
            'answers' => json_encode($request->input('answers')),
            'who_answered' => $who_answered,
        ];

        $result = StartQuestionAnswers::create($data);

        if ($result)
            return response()->json(['response' => $uniq_code], 200);
        else
            return response()->json(['error' => 'Failed to save answers'], 500);

    }
    public function saveQuestionAnswersUpdate(Request $request)
    {
        // Validate the request data
        $request->validate([
            'uniq_id' => 'required|integer',
            'user_id' => 'required|integer',
        ]);

        $answer = StartQuestionAnswers::where('uniq_id', $request->input('uniq_id'))->first();

        $answers = $answer->who_answered = $request->input('user_id');

        $result = StartQuestionAnswers::update($answers);

        if ($result)
            return response()->json(200);
        else
            return response()->json(['error' => 'Failed to save answers'], 500);

    }

    // public function getAnswerDetail($id)
    // {
    //     // ID'ye göre kaydı bul, yoksa 404 hatası fırlat
    //     $answerDetail = StartQuestionAnswers::find($id);

    //     if (!$answerDetail) {
    //         return response()->json(['error' => 'Answer not found'], 404);
    //     }

    //     // Veritabanında json_encode ile saklanan veriyi tekrar dizi/obje haline getiriyoruz
    //     // Not: Eğer modelde 'casts' kullanıyorsan buna gerek kalmaz.
    //     if (is_string($answerDetail->answers)) {
    //         $answerDetail->answers = json_decode($answerDetail->answers);
    //     }

    //     return response()->json($answerDetail, 200);
    // }

}