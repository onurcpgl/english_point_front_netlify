<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InstructorPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Tüm ödemeleri listele (Admin için)
     * İlişkili eğitmen ve ders bilgileriyle beraber getirir.
     */
    public function index()
    {
        // Sayfalama (Pagination) ile verileri çekiyoruz.
        // latest() ile en son eklenen en üstte gelir.
        $payments = InstructorPayment::with(['instructor', 'session'])
            ->latest()
            ->paginate(15);

        return response()->json([
            'status' => true,
            'message' => 'Ödemeler listelendi.',
            'data' => $payments
        ], 200);
    }

    /**
     * Belirli bir ödemenin detayını göster.
     */
    public function show($id)
    {
        $payment = InstructorPayment::with(['instructor', 'session'])->find($id);

        if (!$payment) {
            return response()->json([
                'status' => false,
                'message' => 'Ödeme kaydı bulunamadı.'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $payment
        ], 200);
    }

    /**
     * Mevcut bir ödemeyi güncelle.
     */
    public function update(Request $request, $id)
    {
        $payment = InstructorPayment::find($id);

        if (!$payment) {
            return response()->json([
                'status' => false,
                'message' => 'Ödeme kaydı bulunamadı.'
            ], 404);
        }

        // 1. Validasyon (Update işleminde bazen tüm alanlar zorunlu olmayabilir, duruma göre 'sometimes' kullanılabilir)
        $validator = Validator::make($request->all(), [
            'instructor_id' => 'exists:instructors,id',
            'course_session_id' => 'exists:course_sessions,id',
            'amount' => 'numeric|min:0',
            'currency' => 'string|max:3',
            'status' => 'in:pending,paid,failed,cancelled',
            'paid_at' => 'nullable|date',
            'transaction_id' => 'nullable|string|max:255',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Doğrulama hatası.',
                'errors' => $validator->errors()
            ], 422);
        }

        // 2. Güncelleme
        $payment->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Ödeme bilgileri güncellendi.',
            'data' => $payment
        ], 200);
    }
}