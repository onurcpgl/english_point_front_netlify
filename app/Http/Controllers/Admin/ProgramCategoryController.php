<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Program;
use App\Models\ProgramCategory;
use Illuminate\Support\Facades\Storage; // Dosya işlemleri için gerekli
use Illuminate\Support\Str;

class ProgramCategoryController extends Controller
{
    /**
     * Tüm kategorileri getirir (Senin yazdığın fonksiyon)
     */
    public function index()
    {
        $programsCat = ProgramCategory::all();
        return response()->json($programsCat);
    }

    /**
     * 1. TEKLİ GETİRME (SHOW)
     * Belirli bir ID'ye sahip kategoriyi getirir.
     */
    public function show($id)
    {
        // Kategoriyi bul, yoksa hata dönmesin diye find kullanıyoruz
        $category = ProgramCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Kategori bulunamadı.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $category
        ], 200);
    }

    /**
     * 2. EKLEME (STORE)
     * Yeni bir kategori oluşturur.
     */
    public function store(Request $request)
    {
        // 1. Validasyon (Gelen veriyi kontrol et)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:program_categories,slug', // Slug benzersiz olmalı
            'is_active' => 'boolean' // 1 veya 0, true veya false
        ]);

        // 2. Slug kontrolü: Eğer slug gönderilmediyse name'den otomatik üret
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // 3. Veritabanına kayıt
        $category = ProgramCategory::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Kategori başarıyla oluşturuldu.',
            'data' => $category
        ], 201);
    }

    /**
     * 3. GÜNCELLEME (UPDATE)
     * Mevcut bir kategoriyi günceller.
     */
    public function update(Request $request, $id)
    {
        // 1. Kategoriyi bul
        $category = ProgramCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Güncellenecek kategori bulunamadı.'
            ], 404);
        }

        // 2. Validasyon
        // 'sometimes': Sadece veri gönderildiyse kuralları işletir.
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            // unique kontrolünde virgülden sonra $id ekleyerek "kendisi hariç" kontrolü yapıyoruz.
            'slug' => 'nullable|string|max:255|unique:program_categories,slug,' . $id,
            'is_active' => 'boolean'
        ]);

        // 3. Eğer isim değiştiyse ve slug boş gönderildiyse yeni slug üret (Opsiyonel)
        if ($request->has('name') && empty($request->input('slug'))) {
            $validated['slug'] = Str::slug($request->input('name'));
        }

        // 4. Güncelleme işlemi
        $category->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Kategori başarıyla güncellendi.',
            'data' => $category
        ], 200);
    }
}