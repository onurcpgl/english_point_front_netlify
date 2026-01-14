<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\InstructorApiController;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\CafesApiController;
use App\Http\Controllers\Admin\CourseSessionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ProgramsController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\GoogleCafeController;
use App\Http\Controllers\Admin\StartQuestionController;
use App\Http\Controllers\Admin\ProgramCategoryController;
use App\Http\Controllers\Admin\ProgramBusinessCategoryController;


/*ProgramCategoryController
|--------------------------------------------------------------------------
| Public Rotalar (Token GEREKTİRMEZ)
|--------------------------------------------------------------------------
| URL Yapısı: http://site.com/admin/login
*/
Route::post('/login', [AdminAuthController::class, 'login']);

// Test rotası: http://site.com/admin/test
Route::get('/test', function () {
    return response()->json(['message' => 'Admin API /admin prefixi ile çalışıyor!']);
});

/*
|--------------------------------------------------------------------------
| Korumalı Admin Rotaları (JWT - admin-api)
|--------------------------------------------------------------------------
| URL Yapısı: http://site.com/admin/users vb.
*/
Route::middleware(['auth:admin-api'])->group(function () {

    // --- Auth İşlemleri ---
    Route::controller(AdminAuthController::class)->group(function () {
        Route::post('/logout', 'logout');
        Route::post('/me', 'me');
        Route::post('/refresh', 'refresh');
    });

    // --- Instructor İşlemleri ---
    Route::controller(InstructorApiController::class)->group(function () {
        Route::get('/instructors', 'Instructors');
        Route::post('/instructor-profile', 'updateAdminProfile');
        Route::get('/instructor-certificate-info', 'AdmincertificateInfo');
        Route::get('/instructor-education-info', 'AdmineducationInfo');
        Route::get('/instructor-language-info', 'languageInfo');
        Route::get('/instructors/{id}', 'instructorDetail'); // <-- Yeni detay rotası
    });

    // --- Cafe İşlemleri ---
    Route::controller(CafesApiController::class)->group(function () {
        Route::get('/cafes/{id}', 'show');
        Route::get('/cafes', 'Cafes');
        Route::post('/cafes', 'store');
        Route::post('/cafes/{id}', 'update');
        Route::delete('/cafes/{id}', 'destroy');
    });
    Route::controller(ProgramCategoryController::class)->group(function () {
        // Tüm kategorileri listeleme
        // Not: Eğer controller içindeki fonksiyon adın 'ProgramCategories' ise 'index' yerine onu yazmalısın.
        Route::get('/program-categories', 'index');

        // Tek bir kategoriyi getirme (id'ye göre)
        Route::get('/program-categories/{id}', 'show');

        // Yeni kategori ekleme
        Route::post('/program-categories', 'store');

        // Kategoriyi güncelleme
        // (Senin örneğindeki gibi POST methoduyla id alarak)
        Route::post('/program-categories/{id}', 'update');

        // Silme (Önceki mesajında hariç demiştin ama yapı bozulmasın diye yorum satırı olarak ekledim)
        // Route::delete('/program-categories/{id}', 'destroy');
    });

    // --- Course Session İşlemleri ---
    Route::controller(CourseSessionController::class)->group(function () {
        Route::get('/course-sessions/resources', 'getFormResources');
        Route::get('/course-sessions', 'index');
        Route::post('/course-sessions', 'store');
        Route::get('/course-sessions/{id}', 'show');
        Route::put('/course-sessions/{id}', 'update');
        Route::delete('/course-sessions/{id}', 'destroy');
        Route::get('/course-sessions/{id}/details', 'getDetailedSession');
    });
    // --- User İşlemleri ---
    Route::controller(UserController::class)->group(function () {
        Route::get('/users', 'index');
        Route::post('/users', 'store');
        Route::get('/users/{id}', 'show');
        Route::put('/users/{id}', 'update');
        Route::delete('/users/{id}', 'destroy');
    });

    // --- Program İşlemleri ---
    Route::controller(ProgramsController::class)->group(function () {
        Route::get('/programs', 'index');   // Listeleme (Controller'daki metod ismin)
        Route::post('/programs', 'store');           // Ekleme
        Route::post('/programs/{id}', 'update');     // Güncelleme (Dosya yükleme olduğu için POST tercih edildi)
        Route::delete('/programs/{id}', 'destroy');  // Silme
        Route::get('/programs/{id}', 'show');  // detay
    });

    // --- Start Question (Başlangıç Soruları) İşlemleri ---
    Route::controller(StartQuestionController::class)->group(function () {
        Route::get('/start-questions', 'StartQuestions'); // Listeleme
        Route::post('/start-questions', 'store');         // Ekleme
        Route::put('/start-questions/{id}', 'update');    // Güncelleme (Sadece data olduğu için PUT uygun)
        Route::delete('/start-questions/{id}', 'destroy');// Silme
        Route::get('/get-answer-detail/{id}', 'getAnswerDetail');// detay

    });

    Route::controller(ProgramBusinessCategoryController::class)->group(function () {
        // Listeleme (Tüm kategoriler)
        Route::get('/program-business-categories', 'index');

        // Ekleme
        Route::post('/program-business-categories', 'store');

        // Detay (Tek bir kategori - id ile)
        Route::get('/program-business-categories/{id}', 'show');

        // Güncelleme
        Route::put('/program-business-categories/{id}', 'update');

        // Silme
        Route::delete('/program-business-categories/{id}', 'destroy');
    });
    //Paymetn İşlemleri 23-12-2025
    // 1. Listeleme (Index)
    Route::get('payments', [PaymentController::class, 'index']);

    // 3. Tekil Ödeme Detayı (Show)
    Route::get('payments/{id}', [PaymentController::class, 'show']);

    // 4. Güncelleme (Update) 
    Route::match(['put', 'patch'], 'payments/{id}', [PaymentController::class, 'update']);

    //Google cafe işlemleri 23-12-2025
    Route::get('google-cafes', [GoogleCafeController::class, 'index']);
    Route::get('google-cafes/{id}', [GoogleCafeController::class, 'show']);

});