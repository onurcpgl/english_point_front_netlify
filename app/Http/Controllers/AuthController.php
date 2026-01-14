<?php

namespace App\Http\Controllers;
use App\Mail\WelcomeMail;
use App\Mail\VerifyLinkMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\URL;
use Tymon\JWTAuth\Facades\JWTAuth;
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'E-posta veya şifre hatalı'], 401);
        }

        $user = JWTAuth::user();

        // --- YENİ EKLENEN KISIM ---
        // Eğer kullanıcının uniq_id'si boşsa oluştur ve kaydet
        if (empty($user->uniq_id)) {
            // UUID kullanmak en güvenlisidir (Örn: 550e8400-e29b...)
            $user->uniq_id = (string) Str::uuid();

            // Eğer daha kısa bir şey istersen UUID satırını silip alttakini aç:
            // $user->uniq_id = Str::random(10); 

            $user->save(); // Veritabanını güncelle
        }
        // --------------------------

        return response()->json([
            'user' => $user, // Güncellenmiş user bilgisi döner
            'token' => $token
        ]);
    }
    public function register(Request $request)
    {
        // Bu kod veritabanında dursun, zararı yok (ilerde manuel kod girmek isterse lazım olur)
        $attendanceCode = random_int(100000, 999999);

        try {
            $request->merge($request->values ?? []); // values yoksa hata vermesin diye ?? [] ekledim

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|unique:users,email',
                'password' => 'required|string|min:6|same:confirmPassword',
                'confirmPassword' => 'required|string|min:6'
            ]);

            // 1. Kullanıcıyı Oluştur
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'email_verified_code' => $attendanceCode,
                'password' => Hash::make($request->password),
                'uniq_id' => Str::uuid(),
            ]);

            // 2. Hoşgeldin Mailini Gönder (Senin mevcut kodun)
            Mail::to($user->email)->send(new WelcomeMail($user->name));

            // 👇 --- YENİ EKLENEN KISIM BAŞLANGIÇ --- 👇

            // 3. Doğrulama Linkini Oluştur (60 Dakika Geçerli)
            // 'verification.verify' ismini route dosyasında tanımlamıştık, oraya gidecek.
            $verificationUrl = URL::temporarySignedRoute(
                'verification.verify', // Rota ismi
                Carbon::now()->addMinutes(60), // Geçerlilik süresi
                [
                    'id' => $user->id,
                    'hash' => sha1($user->email) // Güvenlik için email hash'i
                ]
            );

            // 4. Linkli Doğrulama Mailini Gönder
            // Oluşturduğumuz $verificationUrl'i mail sınıfına veriyoruz
            Mail::to($user->email)->send(new VerifyLinkMail($verificationUrl));

            // 👆 --- YENİ EKLENEN KISIM BİTİŞ --- 👆

            return response()->json([
                'message' => 'Kayıt başarılı! Lütfen mailinize gelen linke tıklayarak hesabınızı onaylayın.',
                'status' => true
            ], 200);

        } catch (ValidationException $e) {
            $errors = collect($e->errors())->flatten()->implode(' | ');
            return response()->json([
                'message' => $errors,
                'status' => false
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Beklenmeyen bir hata oluştu: ' . $e->getMessage(),
                'status' => false
            ], 200);
        }
    }
    public function verifyLink(Request $request, $id)
    {
        // 1. İmza Geçerli mi?
        if (!$request->hasValidSignature()) {
            // İmza bozuksa Frontend Login'e hata koduyla at
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/login?error=invalid_link');
        }

        $user = User::findOrFail($id);

        // 2. Zaten onaylı değilse onayla
        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            $user->email_verified_code = null; // Kod varsa temizle
            $user->save();
        }

        // 3. ✅ ASIL DÜZELTME BURASI ✅
        // İşlem bitti, şimdi Next.js (Port 3000) tarafına postala

        $frontendUrl = env('FRONT_URL', 'http://localhost:3000');

        return redirect($frontendUrl . '/login?verified=true');
    }


    public function redirectToProvider($provider)
    {
        // Provider geçerli mi diye basit bir kontrol (Opsiyonel ama iyi olur)
        if (!in_array($provider, ['google', 'facebook'])) {
            return response()->json(['error' => 'Geçersiz sağlayıcı'], 404);
        }

        return Socialite::driver($provider)->stateless()->redirect();
    }
    // Socialite callback (provider'dan geri dönüş)
    public function handleProviderCallback($provider)
    {
        try {
            // 1. Google/Facebook'tan veriyi al
            $socialUser = Socialite::driver($provider)->stateless()->user();

            // Sütun adı belirleme (google_id, facebook_id)
            $idColumn = $provider . '_id';

            // 2. Kullanıcıyı Email ile bul
            $user = User::where('email', $socialUser->getEmail())->first();

            if ($user) {
                // --- DURUM: Kullanıcı Zaten Var ---

                // Eğer daha önce bu sosyal ağ ile girmemişse ID'yi güncelle (Hesap Birleştirme)
                if (empty($user->{$idColumn})) {
                    $user->update([
                        $idColumn => $socialUser->getId(),
                        'avatar' => $user->avatar ?: $socialUser->getAvatar() // Avatar yoksa güncelle
                    ]);
                }
            } else {
                // --- DURUM: Kullanıcı Hiç Yok (Yeni Kayıt) ---

                // BURASI KRİTİK: Varsayılan değerleri (role, status vb.) elle veriyoruz.
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    $idColumn => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                    'email_verified_at' => now(), // E-postayı onaylı işaretle
                    'password' => bcrypt(Str::random(16)),
                    'role' => 'user', // Varsayılan rolü MUTLAKA belirt (Frontend bunu kontrol ediyor olabilir)
                    // 'status'         => 1,      // Eğer veritabanında aktif/pasif sütunu varsa bunu açmalısın
                ]);
            }

            // 3. Token Oluştur
            // Eğer JWTAuth ayarlarında "custom claims" varsa burada eklenmeli.
            $token = JWTAuth::fromUser($user);

            // 4. Güvenli URL Oluşturma
            // Manuel string birleştirme yerine `http_build_query` kullanıyoruz.
            // Bu sayede avatar linkindeki özel karakterler URL'i bozmaz.
            $queryParams = http_build_query([
                'token' => $token,
                'user_role' => $user->role ?? 'user',
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'new_user' => $user->wasRecentlyCreated ? 'true' : 'false' // Frontend'e yeni kayıt olduğunu bildirir
            ]);

            $frontendUrl = env('NEXTAUTH_URL') . '/api/auth/social-callback?' . $queryParams;

            return redirect($frontendUrl);

        } catch (\Exception $e) {
            // Hata logunu detaylandır
            \Illuminate\Support\Facades\Log::error($provider . ' Login Hatası: ' . $e->getMessage() . ' | Satır: ' . $e->getLine());

            // Kullanıcıyı hata mesajıyla frontend login sayfasına at
            return redirect(env('NEXTAUTH_URL') . '/login?error=SocialLoginFailed');
        }
    }


}