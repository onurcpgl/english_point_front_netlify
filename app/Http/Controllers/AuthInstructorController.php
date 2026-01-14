<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;
use Illuminate\Support\Facades\DB;
use App\Notifications\InstructorRegistered;
use Illuminate\Support\Str;
use App\Models\InstructorPasswordReset;
use App\Notifications\InstructorPasswordResetNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\App;

class AuthInstructorController extends Controller
{
    public function instructorLogin(Request $request)
    {

        $credentials = $request->only('email', 'password');

        // JWT ile instructor guard üzerinden login denemesi
        if (!$token = auth('instructor')->attempt($credentials)) {
            return response()->json(['error' => 'Email or password is incorrect.'], 200);
        }

        // Login başarılı, token ve user bilgisi döndür
        $instructor = auth('instructor')->user();

        if ($instructor->status !== 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Your account is inactive. Password reset is not allowed.',
            ], 200);
        }

        if ($instructor->profile_image) {
            $instructor->profile_image = url('storage/' . str_replace('\\', '/', $instructor->profile_image));
        }

        // Sadece aktif fotoğrafı al
        $activePhoto = $instructor->photos->where('is_active', 1)->first();

        $instructor->photo = $activePhoto
            ? url('storage/' . str_replace('\\', '/', $activePhoto->photo_path))
            : null;

        // Gereksiz photos ilişkisini kaldırabiliriz
        unset($instructor->photos);

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => $instructor,
            'token' => $token,
        ]);
    }
    public function registerInstructor(Request $request)
    {
        try {
            DB::beginTransaction();

            $validator = Validator::make($request->all(), [
                // About bilgileri
                'about.firstName' => 'required|string|max:255',
                'about.lastName' => 'required|string|max:255',

                'about.email' => 'required|email|unique:instructors,email',
                'about.phone' => 'required|string|max:20',
                'about.country_birth' => 'required|string',
                'about.current_location' => 'required|string',
                'about.current_city' => 'required|string',
                'about.level' => 'required|string',

                'description.bio' => 'required|string|max:255',
                // Fotoğraf
                'photo.file' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',

                // Sertifikalar
                'certifications.*.name' => 'nullable|string|max:255',
                'certifications.*.issuer' => 'nullable|string|max:255',
                'certifications.*.uploadCertificate' => 'nullable|file|mimes:pdf,png,jpg,jpeg|max:4096',

                // Eğitim geçmişi
                'educations.*.university' => 'nullable|string|max:255',
                'educations.*.degree' => 'nullable|string|max:255',
                'educations.*.specialization' => 'nullable|string|max:255',
                'educations.*.graduationYear' => 'nullable|string|max:10',
                'educations.*.uploadDegree' => 'nullable|file|mimes:pdf,png,jpg,jpeg|max:4096',

            ], [
                // About custom messages
                'about.firstName.required' => 'First name is required.',
                'about.lastName.required' => 'Last name is required.',
                'about.email.required' => 'Email address is required.',
                'about.email.email' => 'Please enter a valid email address.',
                'about.email.unique' => 'This email address is already taken.',
                'about.phone.required' => 'Phone number is required.',
                'about.country_birth.required' => 'Country of birth is required.',
                'about.current_location.required' => 'Current location is required.',
                'about.current_city.required' => 'Current city is required.',
                'about.level.required' => 'Level is required.',


                // Photo messages
                'photo.file.image' => 'Photo must be an image.',
                'photo.file.mimes' => 'Photo must be a JPEG, JPG or PNG file.',
                'photo.file.max' => 'Photo must not exceed 2MB.',

                // Certifications messages
                'certifications.*.uploadCertificate.file' => 'Certificate must be a file.',
                'certifications.*.uploadCertificate.mimes' => 'Certificate must be PDF, PNG, JPG, or JPEG.',
                'certifications.*.uploadCertificate.max' => 'Certificate file must not exceed 4MB.',

                // Educations messages
                'educations.*.uploadDegree.file' => 'Degree must be a file.',
                'educations.*.uploadDegree.mimes' => 'Degree must be PDF, PNG, JPG, or JPEG.',
                'educations.*.uploadDegree.max' => 'Degree file must not exceed 4MB.',
            ]);


            if ($validator->fails()) {
                $errors = collect($validator->errors()->toArray())
                    ->map(function ($messages, $key) {
                        // sadece ilk hatayı alıyoruz
                        return $messages[0];
                    })
                    ->values(); // key'leri kaldır, sadece mesajları bırak

                return response()->json([
                    'status' => 'error',
                    'errors' => $errors,
                ], 200);
            }

            // Eğitmen temel bilgileri
            $about = $request->input('about', []);
            $description = $request->input('description', []);

            $instructorData = [
                'first_name' => $about['firstName'] ?? null,
                'last_name' => $about['lastName'] ?? null,
                'email' => $about['email'] ?? null,
                'about' => $description['bio'] ?? null,
                'phone' => $about['phone'] ?? null,
                'country_birth' => $about['country_birth'] ?? null,
                'current_location' => $about['current_location'] ?? null,
                'current_city' => $about['current_city'] ?? null,
                'level' => $about['level'] ?? null,
            ];

            $instructor = Instructor::create($instructorData);

            // Fotoğraf kaydetme
            if ($request->hasFile('photo.file')) {
                $file = $request->file('photo.file');
                $path = $file->store('instructors', 'public');

                $instructor->photos()->create([
                    'photo_path' => $path
                ]);
            }

            // Sertifikalar
            if ($request->has('certifications')) {
                foreach ($request->certifications as $certificate) {

                    // Dosya kaydı varsa işle
                    if (isset($certificate['uploadCertificate']) && $certificate['uploadCertificate'] instanceof \Illuminate\Http\UploadedFile) {
                        $path = $certificate['uploadCertificate']->store('certificates', 'public');
                        $certificate['uploadCertificate'] = $path; // DB'ye path olarak yaz
                    }

                    // Hepsi boş mu kontrol et
                    $filled = array_filter($certificate, fn($value) => !empty($value));
                    if (empty($filled)) {
                        continue;
                    }

                    $instructor->certificates()->create([
                        'certification' => $certificate['name'] ?? null,
                        'issuer' => $certificate['issuer'] ?? null,
                        'years_of_study' => $certificate['year'] ?? null,
                        'certificate_file_path' => $certificate['uploadCertificate'] ?? null,
                    ]);
                }
            }

            // Eğitim geçmişi
            if ($request->has('educations')) {
                foreach ($request->educations as $education) {

                    // Dosya kaydı varsa işle
                    if (isset($education['uploadDegree']) && $education['uploadDegree'] instanceof \Illuminate\Http\UploadedFile) {
                        $path = $education['uploadDegree']->store('degrees', 'public');
                        $education['uploadDegree'] = $path;
                    }

                    $filled = array_filter($education, fn($value) => !empty($value));
                    if (empty($filled)) {
                        continue;
                    }

                    $instructor->educations()->create([
                        'university' => $education['university'] ?? null,
                        'degree' => $education['degree'] ?? null,
                        'degree_type' => $education['degree_type'] ?? null,
                        'specialization' => $education['specialization'] ?? null,
                        'years_of_study' => $education['graduationYear'] ?? null,
                        'diploma_file_path' => $education['uploadDegree'] ?? null,
                    ]);
                }
            }

            // Uygunluk saatleri
            if ($request->has('availability')) {
                foreach ($request->availability as $item) {
                    $instructor->availabilities()->create([
                        'day_of_week' => $item['day'] ?? null,
                        'time_from' => $item['timeFrom'] ?? null,
                        'time_to' => $item['timeTo'] ?? null,
                    ]);
                }
            }

            DB::commit(); // başarılı ise commit

            // Mail::to($instructor->email)->send(new WelcomeMail($instructor));
            $instructor->notify(new InstructorRegistered($instructor));

            return response()->json([
                'message' => 'Instructor created successfully',
                'status' => "success",
                //'instructor' => $instructor->load('photos', 'certificates', 'educations', 'availabilities')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // hata olursa rollback
            $errorMessage = $e->getMessage();
            // Örnek: E-mail benzersiz değilse
            if (str_contains($e->getMessage(), 'Duplicate entry')) {
                $errorMessage = 'This email address is already registered.';
            }

            // Örnek: Zorunlu alan eksikse
            if (str_contains($e->getMessage(), 'cannot be null')) {
                $errorMessage = 'Some required fields are missing. Please check your form.';
            }

            // Örnek: Foreign key ihlali
            if (str_contains($e->getMessage(), 'foreign key constraint')) {
                $errorMessage = 'Invalid related data provided.';
            }

            return response()->json([
                'status' => 'error',
                'message' => $errorMessage,
            ], status: 200);
        }
    }
    public function requestResetPassword(Request $request)
    {
        App::setLocale('en');
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:instructors,email',
        ]);



        $instructor = Instructor::where('email', $request->email)->first();

        if ($validator->fails()) {
            // İlk hatayı al, tek tip formatta döndür
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first('email'),
            ], 200); // 200 dönüyoruz ki frontend hata blokları düzgün çalışsın
        }

        // Status kontrolü
        if ($instructor->status !== 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Your account is inactive. Password reset is not allowed.',
            ], 200);
        }


        $token = Str::uuid()->toString();

        // Token kaydı oluştur
        InstructorPasswordReset::create([
            'instructor_id' => $instructor->id,
            'token' => $token,
            'used' => false,
        ]);

        // Reset link
        $frontUrl = env('FRONT_URL', 'http://localhost:3000'); // env'den al, yoksa default localhost
        $resetLink = $frontUrl . "/instructor-reset-password/{$token}";

        // Notification ile mail gönder
        $instructor->notify(new InstructorPasswordResetNotification($instructor, $resetLink));
        //$instructor->notify(new InstructorRegistered($instructor));
        return response()->json([
            'status' => 'success',
            'message' => 'Password reset link has been sent to your email.',
        ]);
    }
    public function resetPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:6',
            'token' => 'required|string|min:6',
        ]);

        $reset = InstructorPasswordReset::where('token', $request->token)->first();

        if (!$reset || $reset->used) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or already used reset link.',
            ], 200);
        }

        $instructor = $reset->instructor;

        $instructor->password = Hash::make(value: $request->password);
        $instructor->save();


        $reset->used = true;
        $reset->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Password has been reset successfully.',
        ]);
    }

    public function checkResetPasswordStatus(Request $request)
    {
        $request->validate([
            'token' => 'required|string|min:6',
        ]);

        $result = InstructorPasswordReset::where('token', $request->token)->first();

        if (!$result) {
            return response()->json([
                'status' => 'error',
                'message' => "This password reset link has already been used or has expired.",
            ], 200);
        }

        if ($result->used != 0) {
            return response()->json([
                'status' => 'error',
                'message' => "This password reset link has already been used or has expired.",
            ], 200);
        }

        // --- created_at zamanını düzgün parse et ve aynı timezone'a çek ---
        // Eğer DB'te UTC saklanıyorsa bunu belirtmek en güvenlisi:
        $dbTimezone = 'UTC'; // DB timestamp'leri genelde UTC olur; eğer farklıysa değiştir
        $appTz = config('app.timezone') ?? date_default_timezone_get(); // uygulama timezone

        // created_at'i DB timezone ile oluşturup uygulama timezone'a çevir
        $createdAt = Carbon::createFromFormat('Y-m-d H:i:s', $result->created_at, $dbTimezone)
            ->setTimezone($appTz);

        // Token'ın geçerlilik süresi (30 dakika)
        $expiresAt = $createdAt->copy()->addMinutes(30);

        // Şu an (uygulama timezone)
        $now = Carbon::now($appTz);

        if ($now->greaterThan($expiresAt)) {
            return response()->json([
                'status' => 'error',
                'message' => "This password reset link has already been used or has expired.",
            ], status: 200);
        }

        // Token geçerli
        return response()->json([
            'status' => 'success',
            'message' => "Token is valid.",
            // opsiyonel: debug için aşağıdakileri dön (canlıda kapat)
            // 'created_at' => $createdAt->toDateTimeString(),
            // 'expires_at' => $expiresAt->toDateTimeString(),
            // 'now' => $now->toDateTimeString(),
        ]);
    }

    public function checkEmailExists(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');

        $exists = Instructor::where('email', $email)->exists();

        if ($exists) {
            return response()->json([
                'status' => 'error',
                'message' => 'This email address is already in use.',
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'This email address is available.',
        ], 200);
    }
}