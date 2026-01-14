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
        Schema::create('google_cafes', function (Blueprint $table) {
            $table->id();

            // Google'ın verdiği benzersiz ID (Aynı cafeyi 2 kere kaydetmemek için unique yapıyoruz)
            $table->string('google_place_id')->unique();

            $table->string('name');
            $table->text('address')->nullable(); // Adres uzun olabilir

            // Koordinatlar için decimal kullanmak en doğrusudur (10 basamak, virgülden sonra 8 hane hassasiyet)
            $table->decimal('lat', 11, 8);
            $table->decimal('lng', 11, 8);

            // Google Fotoğraf URL'leri ÇOK uzundur, mutlaka 'text' veya 'longtext' olmalı.
            $table->text('image')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('google_cafes');
    }
};