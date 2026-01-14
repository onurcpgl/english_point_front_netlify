<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use App\Models\CourseSession;
use App\Models\CourseSessionUser;
use Illuminate\Support\Str;
use App\Models\SessionBasket;

class UserController extends Controller
{
    // 1. Kullanıcı profil bilgilerini getir
    public function profile()
    {
        $user = Auth::user();

        if ($user) {
            if ($user->profile_image) {
                // KONTROL BURADA:
                // Eğer resim yolu 'http' ile başlıyorsa (Google vb.), olduğu gibi bırak.
                // Başlamıyorsa (Local dosya), başına storage URL'ini ekle.

                if (!Str::startsWith($user->profile_image, ['http://', 'https://'])) {
                    $user->profile_image = url(
                        sprintf('storage/%s', str_replace('\\', '/', $user->profile_image))
                    );
                }
                // Else durumuna gerek yok, zaten http ile başlıyorsa direkt kendisi geçerli bir linktir.
            }

            return response()->json([
                'success' => true,
                'user' => $user,
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Kullanıcı bulunamadı.',
            ], 401);
        }
    }
    // 2. Profil bilgilerini güncelle
    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $data = $request->only(['name', 'email', 'phone']);

        // Eğer bir profil resmi yüklendiyse, işlemi yap
        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $path = $file->store('profile_images', 'public');
            $data['profile_image'] = $path;
        }


        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Profil başarıyla güncellendi.',
            'user' => $user,
            'uploaded_image_path' => isset($path) ? $path : null, // Yüklenen resmin yolunu göster
        ]);
    }


    // 3. Fotoğraf güncelle
    public function updatePhoto(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Eski fotoğrafı sil
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }

        // Yeni fotoğrafı kaydet
        $path = $request->file('photo')->store('profile-photos', 'public');

        $user->photo = $path;
        $user->save();

        return response()->json([
            'message' => 'Fotoğraf güncellendi',
            'photo_url' => asset('storage/' . $path),
        ]);
    }

    // 4. Şifre değiştir
    public function changePassword(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Gelen request validasyonu
        $validated = $request->validate([
            'currentPassword' => 'required',
            'password' => 'required|min:6|same:confirmPassword',
            'confirmPassword' => 'required|min:6',
        ]);

        // Mevcut şifreyi kontrol et
        if (!Hash::check($validated['currentPassword'], $user->password)) {
            return response()->json(['error' => 'Mevcut şifre yanlış'], 400);
        }

        // Yeni şifreyi kaydet
        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json(['message' => 'Şifre başarıyla değiştirildi']);
    }

    public function getUserSession(Request $request)
    {
        $user = Auth::user();

        // 1. EAGER LOAD (Mutlaka 'courseSession.googleCafe' ekli olmalı)
        $sessions = CourseSessionUser::with([
            'courseSession.cafe',
            'courseSession.program.category',
            'courseSession.googleCafe', // <--- İlişkiyi yükledik
            'courseSession.instructor'
        ])
            ->where('user_id', $user->id)
            ->whereIn('attendance_status', ['registered', 'attended', 'completed', 'instructor_absent', 'canceled_by_user', 'no_show', 'instructor_absent'])
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. TRANSFORM
        $sessions->transform(function ($item) {

            $session = $item->courseSession;

            // Varsayılan olarak null ata
            // setAttribute kullanarak Laravel'in serileştirme (JSON) mekanizmasına dahil ediyoruz.
            $item->setAttribute('show_cafe', null);

            if ($session) {
                // GOOGLE CAFE VARSA
                // DİKKAT: $session->google_cafe DEĞİL, $session->googleCafe (Modeldeki fonksiyon adı)
                if ($session->google_cafe_id && $session->googleCafe) {

                    $item->setAttribute('show_cafe', $session->googleCafe);

                }
                // NORMAL CAFE VARSA_
                elseif ($session->cafe_id) {

                    $item->setAttribute('show_cafe', $session->cafe);
                }
            }

            return $item;
        });

        return response()->json([
            'success' => true,
            'sessions' => $sessions
        ]);
    }
    public function messages()
    {
        $user = auth()->user();

        // Next.js tarafında tüm listeyi göstermek istersen 'notifications'
        // Sadece okunmamışları istersen 'unreadNotifications' kullanabilirsin.

        // Verileri çekiyoruz (en yeniden eskiye sıralı gelir)
        $notifications = $user->notifications;

        // ÖNEMLİ: Blade dosyası aramıyoruz, direk veriyi JSON olarak basıyoruz.
        return response()->json([
            'success' => true,
            'data' => $notifications
        ]);
    }

    // Mesajı "Okundu" olarak işaretlemek için bir route yapabilirsin
    public function markAsRead($id)
    {
        $user = auth()->user();

        // Sadece giriş yapan kullanıcıya ait bildirimi buluyoruz (Güvenlik için önemli)
        $notification = $user->notifications()->find($id);

        if ($notification) {
            $notification->markAsRead();

            return response()->json([
                'success' => true,
                'message' => 'Bildirim okundu olarak işaretlendi.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Bildirim bulunamadı.'
        ], 404);
    }
    public function show($id)
    {
        // Kullanıcıyı ilişkili olduğu verilerle birlikte çekiyoruz (Örn: Oturumlar)
        $user = \App\Models\User::with(['courseSessions.program', 'courseSessions.cafe'])->find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Kullanıcı bulunamadı.'], 404);
        }

        // Resim yolu düzenleme (Profil metodundaki mantığın aynısı)
        if ($user->profile_image) {
            if (!\Illuminate\Support\Str::startsWith($user->profile_image, ['http://', 'https://'])) {
                $user->profile_image = url(
                    sprintf('storage/%s', str_replace('\\', '/', $user->profile_image))
                );
            }
        }

        return response()->json([
            'success' => true,
            'user' => $user,
        ]);
    }

}