<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Kullanıcı Listesi (Pagination ve Arama ile)
     */
    public function index(Request $request)
    {
        $query = User::query();

        // React tarafından ?search=ahmet gibi bir parametre gelirse arama yap
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Katıldığı kursları ve adresleri de görelim mi? Gerekirse ->with(...) ekle
        // $users = $query->with('courseSessions')->orderBy('created_at', 'desc')->paginate(10);

        $users = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json($users);
    }

    /**
     * Yeni Kullanıcı Ekleme (Admin panelinden manuel ekleme)
     */
    public function store(Request $request)
    {
        // 1. Validasyon
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|min:6', // Yeni eklerken şifre zorunlu olsun
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Veriyi Hazırla ve Şifreyi Hashle
        $userData = $request->except('password');
        $userData['password'] = Hash::make($request->password);

        // Profil resmi yükleme mantığı buraya eklenebilir (dosya upload varsa)

        $user = User::create($userData);

        return response()->json([
            'status' => 'success',
            'message' => 'Kullanıcı başarıyla oluşturuldu.',
            'data' => $user
        ], 201);
    }

    /**
     * Tek bir kullanıcının detayını getir (Edit formunu doldurmak için)
     */
    public function show($id)
    {
        // İlişkileriyle beraber çekiyoruz (Hangi kurslara gitmiş, adresi neymiş vs.)
        $user = User::with(['courseSessions', 'addresses'])->find($id);

        if (!$user) {
            return response()->json(['message' => 'Kullanıcı bulunamadı'], 404);
        }

        return response()->json($user);
    }

    /**
     * Kullanıcı Güncelleme
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Kullanıcı bulunamadı'], 404);
        }

        // 1. Validasyon
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            // Email benzersiz olmalı AMA kendi ID'si hariç (ignore)
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|min:6', // Güncellerken şifre zorunlu değil (boş bırakabilir)
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Veriyi Hazırla
        $userData = $request->except('password');

        // Şifre alanı dolu geldiyse hashle ve güncelle, boşsa dokunma
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        // 3. Güncelle
        $user->update($userData);

        return response()->json([
            'status' => 'success',
            'message' => 'Kullanıcı bilgileri güncellendi.',
            'data' => $user
        ]);
    }

    /**
     * Kullanıcı Silme
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Kullanıcı bulunamadı'], 404);
        }

        // İsteğe bağlı: Kullanıcının kayıtlı olduğu kurslardan düşürmek gerekebilir.
        // $user->courseSessions()->detach(); 

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kullanıcı silindi.'
        ]);
    }
}