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
        // 1. Önce eski/eksik tabloyu tamamen kaldırıyoruz
        Schema::dropIfExists('programs');

        // 2. Şimdi olması gerektiği gibi yeniden kuruyoruz
        Schema::create('programs', function (Blueprint $table) {
            $table->id();

            // Çeviri Alanları (JSON)
            $table->json('title');
            $table->json('description')->nullable();

            // Sabit Alanlar
            $table->string('slug')->unique();

            // Medya
            $table->string('video_url')->nullable();
            $table->string('voice_path')->nullable();
            $table->string('document_path')->nullable();

            // Diğer
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};