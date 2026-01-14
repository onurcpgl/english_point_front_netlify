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
        Schema::create('instructor_payments', function (Blueprint $table) {
            $table->id();

            // Parayı kazanan eğitmen
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Hangi ders karşılığında bu para kazanıldı? (Opsiyonel olabilir, bonus ödemeler için)
            $table->foreignId('course_session_id')->nullable()->constrained('course_sessions')->onDelete('set null');

            // Miktar (DİKKAT: Para işlerinde float/double kullanılmaz, decimal kullanılır)
            // 10,2 demek: Toplam 10 basamak, virgülden sonra 2 basamak (Örn: 12345678.99)
            $table->decimal('amount', 10, 2);

            // Para Birimi (USD, TRY, EUR)
            $table->string('currency', 3)->default('TRY');

            // Ödemenin Durumu
            // pending: Ders bitti, bakiye eklendi ama henüz hocaya para gönderilmedi.
            // paid: Para hocanın banka hesabına gönderildi.
            // cancelled: Ders iptal oldu, ödeme geri çekildi.
            $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending');

            // Eğer ödeme yapıldıysa, ne zaman yapıldı?
            $table->timestamp('paid_at')->nullable();

            // Banka dekont no veya Stripe transfer ID (İlerisi için)
            $table->string('transaction_id')->nullable();

            // Yönetici notu (Örn: "Manuel düzeltme")
            $table->text('note')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('instructor_payments');
    }
};