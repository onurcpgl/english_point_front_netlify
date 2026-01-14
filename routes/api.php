<?php

use App\Http\Controllers\SessionBasketController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StartQuestionController;
use App\Http\Controllers\InstructorsController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthInstructorController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\UserController;
use App\Models\Instructor;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CourseSessionUserController;
use App\Http\Controllers\UserPasswordController;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ProgramController;
use App\Mail\AccountApprovedMail;
use App\Mail\ResetPasswordMail;





Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/test-mail', function () {
    // Örnek instructor verisi
    $instructor = (object) [
        'first_name' => 'Onur',
        'email' => 'ocopoglu@socialthinks.com'
    ];

    Mail::to($instructor->email)->send(new AccountApprovedMail($instructor));

    return 'Mail gönderildi!';
});




Route::get('get-start-questions', [StartQuestionController::class, 'getStartQuestions']);

Route::post('save-question-answers', [StartQuestionController::class, 'saveQuestionAnswers']);
Route::put('update-question-answers', [StartQuestionController::class, 'saveQuestionAnswersUpdate']);
Route::get('get-by-question-answers/{slug}', [StartQuestionController::class, 'getByStartQuestionsAnswers']);



Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->get('/me', function () {
    return response()->json(Auth::user());
});

// Google ve Facebook OAuth redirect ve callback
Route::get('/auth/{provider}/redirect', [AuthController::class, 'redirectToProvider']);
Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback']);


//Eğitmenler
Route::get('/instructors', [InstructorsController::class, 'getInstructors']);

//Eğitimler
Route::get('/get-course-sessions', [SessionController::class, 'getCourseSessions']);
Route::get('/get-course-sessions/{id}', [SessionController::class, 'getCourseSessionsById']);
Route::get('/get-course-session-single/{id}', [SessionController::class, 'getCourseSessionSingle']);



Route::get('/get-course-quota-info', [SessionController::class, 'getCourseSessionQuotaInfo']);



//Eğitim kategorileri
Route::get('/get-course-categories', [CategoryController::class, 'getSessionCategories']);


//Kullanıcı eğitim kayıt
Route::post('/course-sessions/{courseSessionId}/register', [App\Http\Controllers\CourseSessionUserController::class, 'userRegisterCourse'])->middleware('auth:api');

//Eğitmen kayıt
Route::post('/instructors', [AuthInstructorController::class, 'registerInstructor']);

//Eğitmen login
Route::post('/instructor/login', [AuthInstructorController::class, 'instructorLogin']);

//Eğitmen şifre unuttum
Route::post('/instructor/forgot-password', [AuthInstructorController::class, 'requestResetPassword']);

//Eğitmen daha önce kayıtlı mı ? 
Route::post('/instructor/check-email', [AuthInstructorController::class, 'checkEmailExists']);


// Token ile şifre sıfırlama
Route::post('/instructor/reset-password', [AuthInstructorController::class, 'resetPassword']);

Route::post('/instructor/check-reset-password', [AuthInstructorController::class, 'checkResetPasswordStatus']);



Route::middleware('auth:instructor')->group(function () {
    //Program bilgisi
    Route::get('/programs', [ProgramController::class, 'index']);

    // Eğitmen bilgisi
    Route::get('/instructor-profile', [InstructorsController::class, 'profile']);
    Route::post('/instructor-profile', [InstructorsController::class, 'updateProfile']);

    // Eğitmen iletişim bilgileri
    Route::get('/instructor-contact-info', [InstructorsController::class, 'contactInfo']);
    Route::put('/instructor-contact-info', [InstructorsController::class, 'updateContactInfo']);

    // Eğitmen eğitim bilgisi
    Route::get('/instructor-education-info', [InstructorsController::class, 'educationInfo']);
    Route::post('/instructor-education-info', [InstructorsController::class, 'addEducation']);
    Route::post('/instructor-education-info/{id}', [InstructorsController::class, 'updateEducation']);

    //Eğitmen sertifika bilgisi
    Route::get('/instructor-certificate-info', [InstructorsController::class, 'certificateInfo']);
    Route::post('/instructor-certificate-info', [InstructorsController::class, 'addCertification']);
    Route::post('/instructor-certificate-info/{id}', [InstructorsController::class, 'updateCertification']);

    //Eğitmen dil bilgisi
    Route::get('/instructor-language-info', [InstructorsController::class, 'languageInfo']);
    Route::post('/instructor-language-info', [InstructorsController::class, 'addLanguage']);
    Route::put('/instructor-language-info/{id}', [InstructorsController::class, 'updateLanguage']);

});



Route::get('/email/verify-link/{id}/{hash}', [AuthController::class, 'verifyLink'])
    ->name('verification.verify');
//User
Route::middleware('auth:api')->group(function () {
    Route::get('/user/profile', [UserController::class, 'profile']);
    Route::post('/user/profile-update', [UserController::class, 'updateProfile']);
    Route::post('/user/profile/photo', [UserController::class, 'updatePhoto']);
    Route::post('/user/change-password', [UserController::class, 'changePassword']);
    Route::get('/user/messages', [UserController::class, 'messages']);
    Route::get('/user/messages-markasread/{id}', [UserController::class, 'markAsRead']);
    //User session
    Route::get('/user/my-session', [UserController::class, 'getUserSession']);
    // İPTAL ETME
    Route::post('/course-sessions/{courseSessionId}/cancel', [CourseSessionUserController::class, 'userCanceledCourse']);
    Route::get('/course-sessions/check-cancel-status/{courseSessionId}', [CourseSessionUserController::class, 'checkCancelStatus']);

});

//User adress apileri
Route::middleware('auth:api')->group(function () {
    Route::get('addresses', [AddressController::class, 'index']);
    Route::post('addresses', [AddressController::class, 'store']);
    Route::get('addresses/{id}', [AddressController::class, 'show']);
    Route::post('addresses-update', [AddressController::class, 'update']);
    Route::patch('addresses/{id}', [AddressController::class, 'update']);
    Route::delete('addresses/{id}', [AddressController::class, 'destroy']);
    Route::post('addresses-main', [AddressController::class, 'saveMainAddress']);
});

//Cafe apisi
Route::get('/get-cafes', [App\Http\Controllers\CafeController::class, 'getCafes']);

//Course session create
Route::middleware(['auth:instructor'])->group(function () {
    Route::post('/course-sessions', [SessionController::class, 'store']);
    Route::post('/course-sessions-update', [SessionController::class, 'update']);
    Route::delete('/course-sessions/{id}', [SessionController::class, 'destroy']);
    Route::get('/get-course-session-users/{id}', [SessionController::class, 'getSessionUsers']);
    Route::get('/get-my-sessions', [InstructorsController::class, 'getInstructorsWithSession']);
    Route::get('/get-my-sessions-active', [InstructorsController::class, 'getInstructorsWithSessionActive']);
    Route::post('/confirm-course-user', [CourseSessionUserController::class, 'userParticipationConfirmation']);
    Route::apiResource('program-categories', App\Http\Controllers\ProgramCategoryController::class);
    //Payment 
    Route::get('/instructor/payments/stats', [PaymentController::class, 'stats']);

    // Eğitmenin ödeme geçmişi tablosu
    Route::get('/instructor/payments/history', [PaymentController::class, 'history']);
    Route::post('/course-sessions/{id}/complete', [SessionController::class, 'sessionCompleted']);

});

//Session Basket APIs
// Session Basket APIs - JWT korumalı
Route::middleware('jwt.auth')->prefix('basket')->group(function () {
    Route::get('/', [SessionBasketController::class, 'index']);
    Route::post('/add', [SessionBasketController::class, 'add']);
    Route::post('/update', [SessionBasketController::class, 'update']);
    Route::post('/remove', [SessionBasketController::class, 'remove']);
    Route::post('/clear', [SessionBasketController::class, 'clear']);
});

Route::prefix('user')->group(function () {
    Route::post('request-reset-password', [UserPasswordController::class, 'requestResetPassword']);
    Route::post('reset-password', [UserPasswordController::class, 'resetPassword']);
    Route::post('check-reset-password-status', [UserPasswordController::class, 'checkResetPasswordStatus']);
});