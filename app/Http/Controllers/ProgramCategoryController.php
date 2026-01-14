<?php

namespace App\Http\Controllers;

use App\Models\ProgramCategory;
use App\Models\ProgramBusinessCategory;

use Illuminate\Http\Request;
use Illuminate\Support\Str; // Slug oluşturmak için gerekli

class ProgramCategoryController extends Controller
{
    /**
     * Tüm kategorileri listeler.
     */
    public function index()
    {
        // Tüm kategorileri getirir.
        // Eğer listeleme ekranında programları da görmek istersen with('programs') ekleyebilirsin.
        $categories = ProgramCategory::with('programs')->get();

        // 2. Business alt kategorilerini çekiyoruz (IT, Law, Medicine vs.)
        $businessSubCategories = ProgramBusinessCategory::all();

        // 3. Ana kategorileri döngüye sokup, Business'ı bulup içine ekleme yapıyoruz
        $categories->map(function ($category) use ($businessSubCategories) {

            // Eğer kategorinin slug'ı 'business' ise (veya ID'si 2 ise)
            if ($category->slug === 'business') {
                // 'sub_categories' isminde yeni bir alan oluşturup verileri içine atıyoruz
                $category->sub_categories = $businessSubCategories;
            } else {
                // Diğer kategoriler (Daily vb.) için boş dizi gönderelim ki Frontend patlamasın
                $category->sub_categories = [];
            }

            return $category;
        });

        // 4. JSON olarak döndürüyoruz
        return response()->json([
            'status' => true,
            'data' => $categories
        ], 200);

    }
    /**
     * Tek bir kategoriyi ve ona bağlı PROGRAMLARI getirir.
     * (İstediğin özellik burası)
     */
    public function show($id)
    {
        // Kategoriyi bulamazsa 404 hatası verir (findOrFail).
        // 'programs' ilişkisini yükleyerek getirir.
        $category = ProgramCategory::with('programs')->findOrFail($id);

        return response()->json([
            'status' => true,
            'data' => $category
        ]);
    }
}