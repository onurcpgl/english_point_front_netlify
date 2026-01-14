<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    // Kullanıcının tüm adreslerini getir
    public function index()
    {
        // Enlem ve boylamı da döndürür
        return response()->json(Auth::user()->addresses);
    }

    // Yeni adres ekle
    public function store(Request $request)
    {
        try {
            // 1. Validasyon (Frontend'den gelen yeni alanları ekledik)
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'address_line' => 'required|string|max:500',
                'city' => 'required|string|max:255',
                'district' => 'required|string|max:255',
                'country' => 'nullable|string|max:255',     // Yeni eklendi
                'postal_code' => 'nullable|string|max:20',
                'latitude' => 'nullable|numeric',            // Yeni eklendi
                'longitude' => 'nullable|numeric',           // Yeni eklendi
                'isDefault' => 'nullable|boolean'            // Frontend'deki checkbox
            ]);

            /** @var \App\Models\User $user */
            $user = Auth::user();

            // 2. Eğer bu adres "Varsayılan" (isDefault) seçildiyse,
            // kullanıcının diğer tüm adreslerinin main_adress özelliğini false yap.
            $isMainAddress = $request->input('isDefault', false); // Varsayılan false

            if ($isMainAddress) {
                $user->addresses()->update(['main_adress' => false]);
            }

            // 3. Veritabanına Kayıt Verisini Hazırla
            // Frontend 'isDefault' gönderiyor, DB 'main_adress' bekliyor.
            $data = [
                'title' => $validated['title'],
                'address_line' => $validated['address_line'],
                'city' => $validated['city'],
                'district' => $validated['district'],
                'country' => $validated['country'] ?? 'Türkiye',
                'postal_code' => $validated['postal_code'] ?? null,
                'latitude' => $validated['latitude'] ?? null,
                'longitude' => $validated['longitude'] ?? null,
                'main_adress' => $isMainAddress, // Mapping işlemi burada
            ];

            // Eğer kullanıcının hiç adresi yoksa, ilk eklenen adres otomatik main_adress olsun
            if ($user->addresses()->count() === 0) {
                $data['main_adress'] = true;
            }

            $address = $user->addresses()->create($data);

            return response()->json([
                'message' => 'Adres başarıyla eklendi.',
                'address' => $address,
                'status' => true
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Doğrulama hatası',
                'errors' => $e->errors(),
                'status' => false
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Bir hata oluştu: ' . $e->getMessage(),
                'status' => false
            ], 500);
        }
    }

    // Adres güncelle
    public function update(Request $request)
    {
        try {
            /** @var \App\Models\User $user */
            $user = Auth::user();

            // Request içinden id ile adresi bul
            $address = $user->addresses()->findOrFail($request->id);

            $validated = $request->validate([
                'id' => 'required|integer|exists:addresses,id',
                'title' => 'nullable|string|max:255',
                'address_line' => 'required|string|max:500',
                'district' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'country' => 'nullable|string|max:255',
                'postal_code' => 'nullable|string|max:20', // Frontend postal_code gönderiyor
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
                'isDefault' => 'nullable|boolean',
            ]);

            // isDefault kontrolü
            $isMainAddress = $request->input('isDefault');

            // Eğer kullanıcı bu adresi varsayılan yapmak istediyse
            if ($isMainAddress === true) {
                // Diğerlerini false yap
                $user->addresses()->where('id', '!=', $address->id)->update(['main_adress' => false]);
                $address->main_adress = true;
            }
            // Eğer isDefault false geldiyse ve bu adres zaten main ise,
            // genelde en az bir main adres olması istendiği için false yapılmasına izin verip vermemek opsiyoneldir.
            // Şimdilik isteğe göre false yapıyoruz:
            elseif ($isMainAddress === false) {
                $address->main_adress = false;
            }

            // Diğer alanları güncelle
            $address->title = $validated['title'] ?? $address->title;
            $address->address_line = $validated['address_line'];
            $address->district = $validated['district'];
            $address->city = $validated['city'];
            $address->country = $validated['country'] ?? $address->country;
            $address->postal_code = $validated['postal_code'] ?? $address->postal_code;

            // Koordinatlar güncellendiyse (veya null değilse) kaydet
            if (isset($validated['latitude']))
                $address->latitude = $validated['latitude'];
            if (isset($validated['longitude']))
                $address->longitude = $validated['longitude'];

            $address->save();

            return response()->json([
                'message' => 'Adres başarıyla güncellendi.',
                'address' => $address,
                'status' => true
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Güncelleme hatası: ' . $e->getMessage(),
                'status' => false
            ], 500);
        }
    }

    // Adres sil
    public function destroy($id)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $address = $user->addresses()->findOrFail($id);

        // Eğer silinen adres ana adres ise, başka bir adresi ana adres yapabilirsin (Opsiyonel)
        // Şimdilik sadece siliyoruz.
        $address->delete();

        return response()->json(['message' => 'Adres silindi', 'status' => true]);
    }

    // Yıldız butonuna basınca çalışacak fonksiyon (Sadece ID gelir)
    public function saveMainAddress(Request $request)
    {
        $request->validate([
            'id' => 'required|integer|exists:addresses,id',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Kullanıcının yetkisi dahilindeki adresi bul
        $address = $user->addresses()->findOrFail($request->id);

        // Transaction başlatmak veri bütünlüğü için iyidir
        DB::transaction(function () use ($user, $address) {
            // 1. Kullanıcının tüm adreslerinin main_adress değerini 0 yap
            $user->addresses()->update(['main_adress' => false]);

            // 2. Seçilen adresi 1 yap
            $address->update(['main_adress' => true]);
        });

        return response()->json([
            'message' => 'Adresiniz favori olarak kaydedildi.',
            'status' => true,
            'address' => $address
        ]);
    }

    // Tek adresi getir
    public function show($id)
    {
        $user = Auth::user();
        $address = $user->addresses()->findOrFail($id);
        return response()->json($address);
    }
}