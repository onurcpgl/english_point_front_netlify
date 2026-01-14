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
        Schema::create('program_categories', function (Blueprint $table) {
            $table->id(); // Otomatik artan ID
            $table->string('name'); // Kategori adı
            $table->string('slug')->unique()->nullable(); // URL dostu isim (opsiyonel ama önerilir)
            $table->boolean('is_active')->default(true); // Aktif/Pasif durumu (opsiyonel)
            $table->timestamps(); // created_at ve updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_categories');
    }
};