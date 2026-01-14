<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Cafe;
class CafesApiController extends Controller
{
    public function Cafes()
    {
        $cafes = Cafe::all();
        return response()->json($cafes);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // sadece dosya yükleme
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');

            // benzersiz isim: zaman + uniqid + orijinal uzantı
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            // hedef dizin: public/dummy_image
            $targetDir = public_path('dummy_image');

            // dizin yoksa oluştur
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0755, true);
            }

            // taşı (move ile public/dummy_image içine koy)
            $file->move($targetDir, $filename);

            // kaydedilecek URL
            $validated['image'] = url('dummy_image/' . $filename);
        } else {
            // dosya yoksa image alanı boş bırakılabilir veya gelen string ise direk kullan
            $validated['image'] = $validated['image'] ?? null;
        }

        // latitude / longitude boşsa default 0 ver
        $validated['latitude'] = $validated['latitude'] ?? 0;
        $validated['longitude'] = $validated['longitude'] ?? 0;

        // Veriyi kaydet
        $cafe = Cafe::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cafe created successfully',
            'data' => $cafe
        ]);
    }
public function show($id)
    {
        $cafe = Cafe::find($id);

        if (!$cafe) {
            return response()->json([
                'success' => false,
                'message' => 'Cafe not found.',
            ], 404);
        }

        return response()->json($cafe);
    }
    public function update(Request $request, $id)
    {
        $cafe = Cafe::find($id);

        if (!$cafe) {
            return response()->json([
                'success' => false,
                'message' => 'Cafe not found.',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'sometimes|in:active,inactive',
            'image' => 'nullable|url|max:500', // URL olarak gelirse
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // dosya yükleme
        ]);

        // Eğer dosya gelmişse upload et
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $path = $file->store('cafes', 'public'); // storage/app/public/cafes
            $validated['image'] = url('storage/' . $path);
        }

        $cafe->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cafe updated successfully',
            'data' => $cafe
        ]);
    }


    public function destroy($id)
    {
        $cafe = Cafe::find($id);

        if (!$cafe) {
            return response()->json([
                'success' => false,
                'message' => 'Cafe not found.',
            ], 404);
        }

        $cafe->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cafe deleted successfully',
        ]);
    }
}