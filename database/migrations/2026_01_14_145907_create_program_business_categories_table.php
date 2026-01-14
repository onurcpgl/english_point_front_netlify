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
        Schema::create('program_business_categories', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique(); // URL dostu ve benzersiz olması için
            $table->timestamps(); // created_at ve updated_at alanlarını oluşturur
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_business_categories');
    }
};