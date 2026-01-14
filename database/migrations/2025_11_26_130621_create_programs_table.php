<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();

            // --- Çevirilebilir Alanlar (JSON OLMALI) ---
            // Spatie Translatable paketi verileri {"tr":"...", "en":"..."} 
            // formatında tutacağı için bu sütunlar JSON tipinde olmalı.
            $table->json('title');
            $table->json('description')->nullable();

            // --- Sabit Alanlar (Çevrilmeyecek) ---
            $table->string('slug')->unique(); // URL yapısı (genelde İngilizce veya Türkçe tek dil tutulur)

            // Medya Alanları
            $table->string('video_url')->nullable();   // Youtube/Vimeo linki
            $table->string('voice_path')->nullable();  // Ses dosyası yolu
            $table->string('document_path')->nullable(); // PDF yolu

            // Diğer Bilgiler
            $table->unsignedInteger('duration_minutes')->nullable(); // Süre (dk)
            $table->boolean('is_active')->default(true); // Aktif/Pasif

            $table->timestamps(); // created_at, updated_at
            $table->softDeletes(); // deleted_at (Silineni geri alma için)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};