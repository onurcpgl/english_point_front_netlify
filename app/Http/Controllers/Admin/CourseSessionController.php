<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseSession;
use App\Models\Instructor;
use App\Models\Cafe;
// Program modelin varsa onu da ekle: use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseSessionController extends Controller
{
    /**
     * Tüm oturumları listele (Pagination ile)
     * React tarafında tabloya basmak için.
     */
    public function index()
    {
        // İlişkilerle (with) beraber çekiyoruz ki tabloda eğitmen adı vs. yazabilsin.
        $sessions = CourseSession::with(['instructor', 'cafe'])
            ->orderBy('session_date', 'desc')
            ->paginate(10); // Sayfa başı 10 kayıt

        return response()->json($sessions);
    }

    /**
     * Yeni oluşturma veya Düzenleme formunu açarken
     * Select-box'ları doldurmak için gereken verileri döner.
     */
    public function getFormResources()
    {
        return response()->json([
            'instructors' => Instructor::all(['id', 'name', 'surname']), // Sadece gereken alanlar
            'cafes' => Cafe::all(['id', 'name']),
            // 'programs' => Program::all(['id', 'name']), // Program modelin varsa
        ]);
    }

    /**
     * Yeni Oturum Kaydetme (Create)
     */
    public function store(Request $request)
    {
        // 1. Validasyon (Gelen veriyi kontrol et)
        $validator = Validator::make($request->all(), [
            'instructor_id' => 'required|exists:instructors,id',
            'cafe_id' => 'required|exists:cafes,id',
            'program_id' => 'nullable|integer', // Program tablon varsa: exists:programs,id
            'session_title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'session_date' => 'required|date',
            'quota' => 'required|integer|min:1',
            'duration_minutes' => 'required|integer|min:1',
            'session_type' => 'required|string', // online, yüz yüze vb.
            'language_level' => 'required|string', // A1, B2 vb.
            'status' => 'required|boolean', // veya string (active/passive)
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Kayıt İşlemi
        $session = CourseSession::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Oturum başarıyla oluşturuldu.',
            'data' => $session
        ], 201);
    }

    /**
     * Tek bir oturumun detayını getir (Edit formunu doldurmak için)
     */
    public function show($id)
    {
        $session = CourseSession::with(['instructor', 'cafe'])->find($id);

        if (!$session) {
            return response()->json(['message' => 'Oturum bulunamadı'], 404);
        }

        return response()->json($session);
    }

    /**
     * Oturumu Güncelleme (Update)
     */
    public function update(Request $request, $id)
    {
        $session = CourseSession::find($id);

        if (!$session) {
            return response()->json(['message' => 'Oturum bulunamadı'], 404);
        }

        // 1. Validasyon
        $validator = Validator::make($request->all(), [
            'instructor_id' => 'sometimes|exists:instructors,id',
            'cafe_id' => 'sometimes|exists:cafes,id',
            'session_title' => 'sometimes|string|max:255',
            'session_date' => 'sometimes|date',
            'quota' => 'sometimes|integer',
            // Diğer alanlar isteğe bağlı (sometimes) güncellenebilir
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Güncelleme
        $session->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Oturum başarıyla güncellendi.',
            'data' => $session
        ]);
    }

    /**
     * Oturumu Silme (Delete)
     */
    public function destroy($id)
    {
        $session = CourseSession::find($id);

        if (!$session) {
            return response()->json(['message' => 'Oturum bulunamadı'], 404);
        }

        $session->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Oturum silindi.'
        ]);
    }
   
    public function getDetailedSession($id)
    {
        $session = CourseSession::with([
            'instructor',
            'cafe',
            'users' => function ($query) {
                $query->select('users.id', 'users.name', 'users.email');
            }
        ])->find($id);

        if (!$session) {
            return response()->json([
                'status' => 'error',
                'message' => 'Oturum bulunamadı'
            ], 404);
        }
        $data = $session->toArray();
        $data['registered_count'] = $session->users()->count();
        $data['remaining_quota'] = $session->quota - $data['registered_count'];
        $data['is_full'] = $data['remaining_quota'] <= 0;
        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}