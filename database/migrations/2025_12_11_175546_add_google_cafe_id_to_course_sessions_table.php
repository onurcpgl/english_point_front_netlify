<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('course_sessions', function (Blueprint $table) {
            // Sütunu ekliyoruz:
            // nullable() -> Kafe seçilmemiş olabilir veya online olabilir.
            // constrained() -> google_cafes tablosundaki id'ye bağlar.
            // nullOnDelete() -> Eğer kafe sistemden silinirse, geçmiş ders kayıtları silinmesin, sadece kafe bilgisi boşalsın.

            $table->foreignId('google_cafe_id')
                ->nullable()
                ->after('instructor_id') // (Opsiyonel) Veritabanında instructor_id'den sonra dursun
                ->constrained('google_cafes')
                ->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('course_sessions', function (Blueprint $table) {
            // Geri alırken önce ilişkiyi (foreign key) sonra sütunu siliyoruz
            $table->dropForeign(['google_cafe_id']);
            $table->dropColumn('google_cafe_id');
        });
    }
};