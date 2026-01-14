<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Instructor;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
class InstructorsController extends Controller
{
    /**
     * Giriş yapmış instructor profili
     */
    public function profile()
    {
        // Token veya guard üzerinden instructor'ı al
        $instructor = Auth::guard('instructor')->user();


        if (!$instructor) {
            return response()->json([
                'success' => false,
                'message' => 'Kullanıcı bulunamadı.',
            ], 401);
        }

        // Instructor ile ilişkili eğitimleri yükle
        $instructor->load(['educations', 'certificates']);

        // Profil resmi varsa URL oluştur
        if ($instructor->profile_image) {
            $instructor->profile_image = url('storage/' . str_replace('\\', '/', $instructor->profile_image));
        }

        // Sadece aktif fotoğrafı al
        $activePhoto = $instructor->photos->where('is_active', 1)->first();
        $instructor->photo = $activePhoto
            ? url('storage/' . str_replace('\\', '/', $activePhoto->photo_path))
            : null;

        // Gereksiz photos ilişkisini kaldır
        unset($instructor->photos);

        return response()->json([
            'success' => true,
            'type' => 'instructor',
            'user' => $instructor,
        ]);
    }
    public function updateProfile(Request $request)
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 401);
        }

        // 🔹 1. Validasyon
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'country_birth' => 'sometimes|string|max:255',
            'current_location' => 'sometimes|string|max:255',
            'current_city' => 'sometimes|string|max:255',
            'profile_image' => 'sometimes|file|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // 🔹 2. Profil fotoğrafı varsa yükle
        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $path = $file->store('instructors', 'public');

            // Mevcut aktif fotoğrafları pasif yap
            $instructor->photos()->update(['is_active' => 0]);

            // Yeni fotoğrafı kaydet
            $instructor->photos()->create([
                'photo_path' => $path,
                'is_active' => 1,
            ]);
        }

        // 🔹 3. Profil bilgilerini güncelle
        $instructor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
        ]);
    }


    public function contactInfo()
    {
        // Token veya guard üzerinden instructor'ı al
        $instructor = Auth::guard('instructor')->user();


        if (!$instructor) {
            return response()->json([
                'success' => false,
                'message' => 'Kullanıcı bulunamadı.',
            ], 401);
        }
        return response()->json([
            'success' => true,
            'type' => 'instructor',
            'user' => $instructor->only(['email', 'phone', 'current_location', 'current_city', 'address', 'zip_code']),
        ]);
    }
    public function updateContactInfo(Request $request)
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json([
                'success' => false,
                'message' => 'Kullanıcı bulunamadı.',
            ], 401);
        }

        // Sadece bu alanların güncellenmesine izin veriyoruz
        $data = $request->only(['email', 'phone', 'current_location', 'current_city', 'address', 'zip_code']);

        // Validation eklemek iyi olur
        $request->validate([
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'current_location' => 'nullable|string|max:255',
            'current_city' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'zip_code' => 'nullable|string|max:20',
        ]);

        $instructor->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Bilgiler başarıyla güncellendi',
            'user' => $instructor->only(['email', 'phone', 'current_location', 'current_city', 'address', 'zip_code']),
        ]);
    }

    public function educationInfo()
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json([
                'success' => false,
                'message' => 'Kullanıcı bulunamadı.',
            ], 401);
        }
        $instructor->load('educations');
        $educations = $instructor->educations->map(function ($edu) {
            return [
                'id' => $edu->id,
                'university' => $edu->university,
                'degree' => $edu->degree,
                'degree_type' => $edu->degree_type,
                'specialization' => $edu->specialization,
                'years_of_study' => $edu->years_of_study,
                'diploma_file_url' => $edu->diploma_file_path
                    ? asset('storage/' . $edu->diploma_file_path)
                    : null,
            ];
        });
        return response()->json([
            'success' => true,
            'type' => 'instructor',
            'user' => array_merge(
                $instructor->only(['first_name', 'last_name', 'level']),
                ['educations' => $educations]
            ),
        ]);
    }
    public function addEducation(Request $request)
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json(['success' => false, 'message' => 'Kullanıcı bulunamadı.'], 401);
        }

        $data = $request->validate([
            'university' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'degree_type' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'years_of_study' => 'nullable|string|max:10',
            'diploma_file' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        ]);

        if ($request->hasFile('diploma_file')) {
            $data['diploma_file_path'] = $request->file('diploma_file')->store('degrees', 'public');
        }

        $education = $instructor->educations()->create($data);

        return response()->json([
            'success' => true,
            'education' => [
                'id' => $education->id,
                'university' => $education->university,
                'degree' => $education->degree,
                'degree_type' => $education->degree_type,
                'specialization' => $education->specialization,
                'years_of_study' => $education->years_of_study,
                'diploma_file_url' => $education->diploma_file_path ? asset('storage/' . $education->diploma_file_path) : null,
            ]
        ]);
    }
    public function updateEducation(Request $request, $id)
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json(['success' => false, 'message' => 'Kullanıcı bulunamadı.'], 401);
        }

        $education = $instructor->educations()->findOrFail($id);

        $data = $request->validate([
            'university' => 'sometimes|string|max:255',
            'degree' => 'sometimes|string|max:255',
            'degree_type' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'years_of_study' => 'nullable|string|max:10',
            'diploma_file' => 'sometimes|file|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('diploma_file')) {
            $data['diploma_file_path'] = $request->file('diploma_file')->store('degrees', 'public');
        }

        $education->update($data);

        return response()->json([
            'success' => true,
            'education' => [
                'id' => $education->id,
                'university' => $education->university,
                'degree' => $education->degree,
                'degree_type' => $education->degree_type,
                'specialization' => $education->specialization,
                'years_of_study' => $education->years_of_study,
                'diploma_file_url' => $education->diploma_file_path ? asset('storage/' . $education->diploma_file_path) : null,
            ]
        ]);
    }

    public function certificateInfo()
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json([
                'success' => false,
                'message' => 'Kullanıcı bulunamadı.',
            ], 401);
        }
        $instructor->load('certificates');
        $certificates = $instructor->certificates->map(function ($cert) {
            return [
                'id' => $cert->id,
                'issuer' => $cert->issuer,
                'certification' => $cert->certification,
                'years_of_study' => $cert->years_of_study,
                'certificate_file_url' => $cert->certificate_file_path
                    ? asset('storage/' . $cert->certificate_file_path)
                    : null,
            ];
        });
        return response()->json([
            'success' => true,
            'type' => 'instructor',
            'user' => array_merge(
                $instructor->only(['first_name', 'last_name', 'level']),
                ['certificate' => $certificates]
            ),
        ]);
    }

    public function addCertification(Request $request)
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json(['success' => false, 'message' => 'Kullanıcı bulunamadı.'], 401);
        }

        $data = $request->validate([
            'issuer' => 'required|string|max:255',
            'certification' => 'required|string|max:255',
            'years_of_study' => 'nullable|string|max:255',
            'certificate_file' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        ]);

        if ($request->hasFile('certificate_file')) {
            $data['certificate_file_path'] = $request->file('certificate_file')->store('degrees', 'public');
        }

        $certification = $instructor->certificates()->create($data);

        return response()->json([
            'success' => true,
            'certification' => [
                'id' => $certification->id,
                'issuer' => $certification->issuer,
                'certification' => $certification->certification,
                'years_of_study' => $certification->years_of_study,
                'certificate_file_path' => $certification->certificate_file_path,
            ]
        ]);
    }
    public function updateCertification(Request $request, $id)
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json([
                'success' => false,
                'message' => 'Kullanıcı bulunamadı.'
            ], 401);
        }

        $certification = $instructor->certificates()->findOrFail($id);

        $data = $request->validate([
            'issuer' => 'sometimes|string|max:255',
            'certification' => 'sometimes|string|max:255',
            'years_of_study' => 'nullable|string|max:10',
            'certificate_file' => 'nullable|file|mimes:jpg,png,pdf|max:2048',
        ]);

        if ($request->hasFile('certificate_file')) {
            $data['certificate_file_path'] = $request->file('certificate_file')->store('certificates', 'public');
        }

        $certification->update($data);

        return response()->json([
            'success' => true,
            'certification' => [
                'id' => $certification->id,
                'issuer' => $certification->issuer,
                'certification' => $certification->certification,
                'years_of_study' => $certification->years_of_study,
                'certificate_file_url' => $certification->certificate_file_path
                    ? asset('storage/' . $certification->certificate_file_path)
                    : null,
            ]
        ]);
    }

    public function languageInfo()
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json(['success' => false, 'message' => 'Kullanıcı bulunamadı.'], 401);
        }

        $languages = $instructor->languages->map(function ($lang) {
            return [
                'id' => $lang->id,
                'language' => $lang->language,
                'level' => $lang->level,
            ];
        });

        return response()->json([
            'success' => true,
            'languages' => $languages,
        ]);
    }
    public function addLanguage(Request $request)
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json(['success' => false, 'message' => 'Kullanıcı bulunamadı.'], 401);
        }

        $data = $request->validate([
            'language' => 'required|string|max:100',
            'level' => 'nullable|string|max:50',
        ]);

        $language = $instructor->languages()->create($data);

        return response()->json([
            'success' => true,
            'language' => $language,
        ]);
    }
    public function updateLanguage(Request $request, $id)
    {
        $instructor = Auth::guard('instructor')->user();

        if (!$instructor) {
            return response()->json(['success' => false, 'message' => 'Kullanıcı bulunamadı.'], 401);
        }

        $language = $instructor->languages()->findOrFail($id);

        $data = $request->validate([
            'language' => 'sometimes|string|max:100',
            'level' => 'nullable|string|max:50',
        ]);

        $language->update($data);

        return response()->json([
            'success' => true,
            'language' => $language,
        ]);
    }

    /**
     * Tüm instructorları listele
     */
    public function getInstructors()
    {
        $instructors = Instructor::all();

        return response()->json([
            'success' => true,
            'instructors' => $instructors,
        ]);
    }

    /**
     * Instructorları ve ilişkili course sessionlarını listele
     */
    public function getInstructorsWithSession()
    {
        try {
            $instructor = Auth::guard('instructor')->user();

            if (!$instructor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            // DEĞİŞİKLİK BURADA YAPILDI:
            // İlişkiyi yüklerken sıralama kısıtlaması (constraint) ekliyoruz.
            $instructor->load([
                'courseSessions' => function ($query) {
                    // session_date alanına göre yeniden eskiye (desc) sırala
                    $query->orderBy('session_date', 'desc');
                },
                // Nested (iç içe) ilişkiyi de ayrıca belirtiyoruz
                'courseSessions.googleCafe'
            ]);

            return response()->json([
                'success' => true,
                'message' => "Instructor with sessions fetched successfully",
                'data' => $instructor,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching instructor data: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getInstructorsWithSessionActive()
    {
        try {
            $instructor = Auth::guard('instructor')->user();

            if (!$instructor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            // DEĞİŞİKLİK BURADA:
            // İlişkiyi yüklerken filtreleme yapmak için bir fonksiyon (Closure) kullandık.
            $instructor->load([
                'courseSessions' => function ($query) {
                    $query->where('status', 'active') // Sadece aktif olanları filtrele
                        ->with('cafe');             // Bu aktif sessionların kafelerini de getir
                }
            ]);

            return response()->json([
                'success' => true, // Başarılı olduğu için true yaptık
                'message' => "Instructor with active sessions fetched successfully",
                'data' => $instructor,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching instructor data',
                'error' => $e->getMessage() // Hata detayını görmek isterseniz (Opsiyonel)
            ], 500);
        }
    }


}