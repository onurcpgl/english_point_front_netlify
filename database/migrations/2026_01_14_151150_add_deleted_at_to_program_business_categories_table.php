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
        Schema::table('program_business_categories', function (Blueprint $table) {
            // Bu komut otomatik olarak 'deleted_at' (timestamp, null olabilir) sütunu ekler
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_business_categories', function (Blueprint $table) {
            // Eğer migration'ı geri alırsan sütunu siler
            $table->dropSoftDeletes();
        });
    }
};