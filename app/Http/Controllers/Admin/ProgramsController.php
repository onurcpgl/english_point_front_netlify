<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Program;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProgramsController extends Controller
{
    public function index()
    {
        // ARTIK TRANSFORM YAPMAYA GEREK YOK, MODEL OTOMATİK YAPIYOR
        $programs = Program::with('category')->latest()->get();

        return response()->json([
            'status' => true,
            'data' => $programs
        ], 200);
    }

    public function store(Request $request)
    {
        // (Burası aynı kalacak, Validasyon vs.)
        $validatedData = $request->validate([
            'program_category_id' => 'required|exists:program_categories,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'business_slug' => 'nullable|string|max:255',
            'video_url' => 'nullable|url',
            'duration_minutes' => 'nullable|integer',
            'is_active' => 'boolean',
            'voice_path' => 'nullable|file|mimes:mp3,wav,ogg|max:10240',
            'document_path' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        $slug = Str::slug($validatedData['title']);
        if (Program::where('slug', $slug)->exists()) {
            $slug = $slug . '-' . time();
        }
        $validatedData['slug'] = $slug;

        if ($validatedData['program_category_id'] != 2) {
            $validatedData['business_slug'] = null;
        }

        if ($request->hasFile('voice_path')) {
            $validatedData['voice_path'] = $request->file('voice_path')->store('programs/voices', 'public');
        }

        if ($request->hasFile('document_path')) {
            $validatedData['document_path'] = $request->file('document_path')->store('programs/documents', 'public');
        }

        $program = Program::create($validatedData);

        return response()->json([
            'message' => 'Program başarıyla oluşturuldu.',
            'data' => $program
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);

        $validatedData = $request->validate([
            'program_category_id' => 'sometimes|integer|exists:program_categories,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'business_slug' => 'nullable|string|max:255',
            'video_url' => 'nullable',
            'duration_minutes' => 'nullable|integer',
            'is_active' => 'boolean',
            'voice_path' => 'nullable|file|mimes:mp3,wav,ogg|max:10240',
            'document_path' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        if ($request->has('title')) {
            $slug = Str::slug($request->title);
            if (Program::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $slug . '-' . time();
            }
            $validatedData['slug'] = $slug;
        }

        $categoryId = $request->input('program_category_id', $program->program_category_id);
        if ((int) $categoryId !== 2) {
            $validatedData['business_slug'] = null;
        }

        if (array_key_exists('video_url', $validatedData) && empty($validatedData['video_url'])) {
            $validatedData['video_url'] = null;
        }

        // --- DİKKAT: BURADA getRawOriginal KULLANIYORUZ ---
        // Çünkü $program->voice_path artık bize "http://localhost..." veriyor.
        // Storage::delete ise "programs/voices/..." bekliyor.
        // getRawOriginal('sütun_adı') veritabanındaki ham halini verir.

        if ($request->hasFile('voice_path')) {
            $oldPath = $program->getRawOriginal('voice_path'); // Ham veri
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            $validatedData['voice_path'] = $request->file('voice_path')->store('programs/voices', 'public');
        }

        if ($request->hasFile('document_path')) {
            $oldPath = $program->getRawOriginal('document_path'); // Ham veri
            if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
            $validatedData['document_path'] = $request->file('document_path')->store('programs/documents', 'public');
        }

        $program->update($validatedData);

        return response()->json([
            'message' => 'Program başarıyla güncellendi.',
            'data' => $program
        ]);
    }

    public function destroy($id)
    {
        $program = Program::findOrFail($id);

        // Soft Delete kullandığın için dosyaları silmiyoruz.
        // Ama ilerde forceDelete yaparsan burada da getRawOriginal kullanmalısın.

        $program->delete();
        return response()->json(['message' => 'Program başarıyla silindi.']);
    }

    public function show($id)
    {
        $program = Program::with('category')->find($id);

        if (!$program) {
            return response()->json(['message' => 'Program bulunamadı.'], 404);
        }

        // BURADA DA MANUEL ÇEVİRMEYE GEREK YOK
        // Model otomatik olarak URL'li halini verecek.

        return response()->json($program);
    }
}