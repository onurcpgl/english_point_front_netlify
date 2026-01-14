<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProgramBusinessCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProgramBusinessCategoryController extends Controller
{
    /**
     * Tüm kategorileri listele.
     */
    public function index()
    {
        // En son eklenenden geriye doğru listeler
        $categories = ProgramBusinessCategory::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $categories
        ], 200);
    }

    /**
     * Yeni bir kategori oluştur.
     */
    public function store(Request $request)
    {
        // Validasyon (Doğrulama)
        $request->validate([
            'title' => 'required|string|max:255|unique:program_business_categories,title',
        ]);

        // Veriyi kaydet
        $category = ProgramBusinessCategory::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title), // Slug otomatik oluşur
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Kategori başarıyla oluşturuldu.',
            'data' => $category
        ], 201);
    }

    /**
     * Belirli bir kategoriyi göster.
     */
    public function show($id)
    {
        $category = ProgramBusinessCategory::find($id);

        if (!$category) {
            return response()->json(['status' => false, 'message' => 'Kategori bulunamadı.'], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $category
        ], 200);
    }

    /**
     * Kategoriyi güncelle.
     */
    public function update(Request $request, $id)
    {
        $category = ProgramBusinessCategory::find($id);

        if (!$category) {
            return response()->json(['status' => false, 'message' => 'Kategori bulunamadı.'], 404);
        }

        // Validasyon (Kendi ID'si hariç diğerlerinde unique kontrolü yapar)
        $request->validate([
            'title' => 'required|string|max:255|unique:program_business_categories,title,' . $id,
        ]);

        // Güncelleme işlemi
        $category->title = $request->title;
        $category->slug = Str::slug($request->title); // Başlık değişirse slug da güncellenir
        $category->save();

        return response()->json([
            'status' => true,
            'message' => 'Kategori güncellendi.',
            'data' => $category
        ], 200);
    }

    /**
     * Kategoriyi sil.
     */
    public function destroy($id)
    {
        $category = ProgramBusinessCategory::find($id);

        if (!$category) {
            return response()->json(['status' => false, 'message' => 'Kategori bulunamadı.'], 404);
        }

        $category->delete();

        return response()->json([
            'status' => true,
            'message' => 'Kategori silindi.'
        ], 200);
    }
}