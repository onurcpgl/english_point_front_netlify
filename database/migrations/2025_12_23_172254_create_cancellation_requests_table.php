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
        Schema::create('cancellation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('course_session_id')->constrained()->onDelete('cascade');
            $table->text('reason'); // Kullanıcının yazdığı sebep
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // Talep durumu
            $table->text('admin_note')->nullable(); // Reddedilirse neden reddedildiği vs.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancellation_requests');
    }
};