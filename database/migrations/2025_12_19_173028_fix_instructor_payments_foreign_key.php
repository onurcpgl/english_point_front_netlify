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
        Schema::table('instructor_payments', function (Blueprint $table) {
            // 1. Hata mesajında adı geçen ESKİ (yanlış) kısıtlamayı kaldırıyoruz.
            // Not: Hata mesajında bu ismin 'instructor_payments_user_id_foreign' olduğu yazıyordu.
            $table->dropForeign('instructor_payments_user_id_foreign');

            // 2. Eğer sütun adın hala 'user_id' ise önce onu 'instructor_id' yapmalısın.
            // Zaten 'instructor_id' ise bu satıra gerek yok ama garanti olsun diye rename yazabiliriz.
            // (Eğer zaten adı instructor_id ise bu satırı silebilirsin)
            // $table->renameColumn('user_id', 'instructor_id');

            // 3. YENİ ve DOĞRU kısıtlamayı ekliyoruz.
            // instructor_id sütunu -> instructors tablosundaki id'ye bağlanacak.
            $table->foreign('instructor_id')
                ->references('id')
                ->on('instructors')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('instructor_payments', function (Blueprint $table) {
            // Geri alırken yeniyi sil, eskiyi geri getir
            $table->dropForeign(['instructor_id']);

            $table->foreign('instructor_id', 'instructor_payments_user_id_foreign')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }
};