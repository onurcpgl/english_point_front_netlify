<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Instructor;
use Illuminate\Support\Facades\Auth;

class InstructorApiController extends Controller
{
    public function Instructors()
    {
        $instructors = Instructor::all();
        return response()->json($instructors);
    }

    public function updateAdminProfile(Request $request)
    {
        $instructor = Instructor::find($request->id);

        if (!$instructor) {
            return response()->json([
                'success' => false,
                'message' => 'Instructor not found.',
            ], 404);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|string|max:20',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $instructor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Instructor updated successfully',
            'data' => $instructor
        ]);
    }
    public function AdmincertificateInfo()
    {
        $instructors = Instructor::with('certificates')->get();

        $data = $instructors->map(function ($instructor) {
            return [
                'id' => $instructor->id,
                'first_name' => $instructor->first_name,
                'last_name' => $instructor->last_name,
                'email' => $instructor->email,
                'phone' => $instructor->phone,
                'status' => $instructor->status,
                'level' => $instructor->level,
                'country_birth' => $instructor->country_birth,
                'current_location' => $instructor->current_location,
                'current_city' => $instructor->current_city,
                'address' => $instructor->address,
                'certificates' => $instructor->certificates->map(function ($cert) {
                    return [
                        'id' => $cert->id,
                        'issuer' => $cert->issuer,
                        'certification' => $cert->certification,
                        'years_of_study' => $cert->years_of_study,
                        'certificate_file_url' => $cert->certificate_file_path
                            ? asset('storage/' . $cert->certificate_file_path)
                            : null,
                    ];
                }),
            ];
        });

        return response()->json([
            'success' => true,
            'instructors' => $data,
        ]);
    }

    public function AdmineducationInfo()
    {
        // Tüm eğitmenleri al
        $instructors = Instructor::with('educations')->get();

        // Her bir eğitmenin eğitimlerini düzenle
        $data = $instructors->map(function ($inst) {
            $educations = $inst->educations->map(function ($edu) {
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

            return [
                'id' => $inst->id,
                'first_name' => $inst->first_name,
                'last_name' => $inst->last_name,
                'level' => $inst->level,
                'educations' => $educations,
            ];
        });

        return response()->json([
            'success' => true,
            'instructors' => $data,
        ]);
    }
    public function languageInfo()
    {
        // Tüm eğitmenleri dilleriyle birlikte çek
        $instructors = \App\Models\Instructor::with('languages')->get();

        if ($instructors->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Hiç eğitmen bulunamadı.'
            ]);
        }

        // Her eğitmeni ve dillerini formatla
        $data = $instructors->map(function ($instructor) {
            return [
                'instructor_id' => $instructor->id,
                'first_name' => $instructor->first_name,
                'last_name' => $instructor->last_name,
                'languages' => $instructor->languages->map(function ($lang) {
                    return [
                        'id' => $lang->id,
                        'language' => $lang->language,
                        'level' => $lang->level,
                    ];
                }),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
public function instructorDetail($id)
{
    // Instructor modelinde certificates, educations ve languages ilişkilerinin 
    // tanımlı olduğunu varsayıyoruz (hasMany).
    $instructor = Instructor::with(['certificates', 'educations', 'languages'])->find($id);

    if (!$instructor) {
        return response()->json([
            'status' => 'error',
            'message' => 'Eğitmen bulunamadı.'
        ], 404);
    }

    return response()->json([
        'status' => 'success',
        'data' => $instructor
    ]);
}

}