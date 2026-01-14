<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\InstructorPayment;
use Carbon\Carbon;
// use Illuminate\Support\Facades\Auth; // Guard helper kullandığımız için buna gerek kalmadı ama dursa da zarar gelmez.

class PaymentController extends Controller
{
    /**
     * 1. DASHBOARD İSTATİSTİKLERİ
     */
    public function stats(Request $request)
    {
        // SENİN İSTEDİĞİN KISIM: Direkt Instructor Guard'dan kullanıcıyı alıyoruz.
        // Bu işlem sana direkt olarak Instructors tablosundaki (ID: 60 olan) kaydı verir.
        $instructor = auth()->guard('instructor')->user();

        if (!$instructor) {
            return response()->json(['status' => false, 'message' => 'Unauthorized / Eğitmen bulunamadı.'], 401);
        }

        // Bekleyen Bakiye
        $pendingBalance = $instructor->payments()
            ->where('status', 'pending')
            ->sum('amount');

        // Toplam Ödenmiş Tutar
        $totalPaid = $instructor->payments()
            ->where('status', 'paid')
            ->sum('amount');

        // Bu Ay Kazanılan
        $thisMonthEarnings = $instructor->payments()
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->whereIn('status', ['pending', 'paid'])
            ->sum('amount');

        return response()->json([
            'status' => true,
            'data' => [
                'pending_balance' => number_format($pendingBalance, 2),
                'total_paid' => number_format($totalPaid, 2),
                'this_month' => number_format($thisMonthEarnings, 2),
                'currency' => 'TRY'
            ]
        ]);
    }

    /**
     * 2. ÖDEME GEÇMİŞİ (Tablo)
     */
    public function history(Request $request)
    {
        // SENİN İSTEDİĞİN KISIM:
        $instructor = auth()->guard('instructor')->user();

        if (!$instructor) {
            return response()->json(['status' => false, 'message' => 'Unauthorized / Eğitmen bulunamadı.'], 401);
        }

        $query = $instructor->payments()->with(['session']);

        // --- FİLTRELER ---
        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $payments = $query->latest()->paginate(10);

        // --- FORMATLAMA (format() on string hatası burada çözüldü) ---
        $formattedPayments = $payments->through(function ($payment) {

            // Tarihleri Carbon ile parse ediyoruz ki hata vermesin
            $sessionDateFormatted = '-';
            $sessionTitle = 'Diğer / Bonus';

            if ($payment->session) {
                // String gelme ihtimaline karşı Carbon::parse
                $sessionDateFormatted = Carbon::parse($payment->session->session_date)->format('d.m.Y H:i');
                $sessionTitle = $payment->session->session_title;
            }

            $paidAtFormatted = $payment->paid_at
                ? Carbon::parse($payment->paid_at)->format('d-m-Y')
                : '-';

            return [
                'id' => $payment->id,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'status' => $payment->status,
                'status_label' => $this->getStatusLabel($payment->status),
                'description' => $payment->session
                    ? "$sessionDateFormatted - $sessionTitle"
                    : "Diğer Ödeme / Bonus",
                // created_at kesin Carbon nesnesi olsa da garantiye alıyoruz
                'created_at' => Carbon::parse($payment->created_at)->format('d-m-Y H:i'),
                'paid_at' => $paidAtFormatted,
                'note' => $payment->note
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $formattedPayments
        ]);
    }

    private function getStatusLabel($status)
    {
        return match ($status) {
            'pending' => 'Bekliyor',
            'paid' => 'Ödendi',
            'cancelled' => 'İptal Edildi',
            default => 'Bilinmiyor',
        };
    }
}