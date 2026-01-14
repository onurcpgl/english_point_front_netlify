<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StartQuestion;

class StartQuestionController extends Controller
{
    // Tüm soruları listeler
    public function StartQuestions()
    {
        $startQuestions = StartQuestion::all();
        return response()->json($startQuestions);
    }

    // Yeni soru oluşturur
    public function store(Request $request)
    {
        // 1. Validasyon Kuralları
        $validatedData = $request->validate([
            // Soru Alanı: {"tr": "Soru?", "en": "Question?"}
            'question' => 'required|array',
            'question.*' => 'string', // Her dilin değeri string olmalı

            // Seçenekler Alanı: {"tr": ["A", "B"], "en": ["A", "B"]}
            'options' => 'required|array',
            'options.*' => 'array',       // Dil anahtarlarının (tr, en) içi bir array olmalı
            'options.*.*' => 'string',    // O array'in içindeki her eleman string olmalı

            // Diğer Alanlar (Swagger şemana göre ekledim)
            'correct_answer' => 'nullable|array', // Doğru cevaplar da array olabilir
            'question_type' => 'required|string', // 'single', 'multiple' vb.
        ]);

        // 2. Kayıt İşlemi
        // Spatie HasTranslations, array gelen veriyi otomatik JSON yapar.
        $startQuestion = StartQuestion::create($validatedData);

        return response()->json([
            'message' => 'Soru başarıyla oluşturuldu.',
            'data' => $startQuestion
        ], 201);
    }

    // Mevcut soruyu günceller
    public function update(Request $request, $id)
    {
        $startQuestion = StartQuestion::findOrFail($id);

        // 1. Validasyon Kuralları (Update için)
        $validatedData = $request->validate([
            'question' => 'sometimes|array',
            'question.*' => 'string',

            'options' => 'sometimes|array',
            'options.*' => 'array',
            'options.*.*' => 'string',

            'correct_answer' => 'nullable|array',
            'question_type' => 'sometimes|string',
        ]);

        // 2. Güncelleme
        $startQuestion->update($validatedData);

        return response()->json([
            'message' => 'Soru başarıyla güncellendi.',
            'data' => $startQuestion
        ]);
    }

    // Soruyu siler
    public function destroy($id)
    {
        $startQuestion = StartQuestion::findOrFail($id);
        $startQuestion->delete();

        return response()->json([
            'message' => 'Soru başarıyla silindi.'
        ]);
    }
     public function getAnswerDetail($id)
    {
        // ID'ye göre kaydı bul, yoksa 404 hatası fırlat
        $answerDetail = StartQuestionAnswers::find($id);

        if (!$answerDetail) {
            return response()->json(['error' => 'Answer not found'], 404);
        }

        // Veritabanında json_encode ile saklanan veriyi tekrar dizi/obje haline getiriyoruz
        // Not: Eğer modelde 'casts' kullanıyorsan buna gerek kalmaz.
        if (is_string($answerDetail->answers)) {
            $answerDetail->answers = json_decode($answerDetail->answers);
        }

        return response()->json($answerDetail, 200);
    }

}