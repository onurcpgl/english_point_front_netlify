"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import instructorPanelService from "../../../utils/axios/instructorPanelService";
import {
  Wallet,
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Loader2,
  Ticket,
  CreditCard,
  Info,
} from "lucide-react";

// --- 1. KAZANÇ TABLOSU VERİSİ (GÖNDERDİĞİN GÖRSELE GÖRE) ---
const EARNING_TIERS = [
  { count: 2, amount: 333 },
  { count: 3, amount: 444 },
  { count: 4, amount: 555 },
  { count: 5, amount: 666 },
  { count: 6, amount: 777 },
];

// --- 2. YARDIMCI BİLEŞENLER ---
const StatusBadge = ({ status }) => {
  const configs = {
    pending: {
      label: "Pending",
      style: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    paid: {
      label: "Paid",
      style: "bg-green-100 text-green-800 border-green-200",
    },
    cancelled: {
      label: "Cancelled",
      style: "bg-red-100 text-red-800 border-red-200",
    },
    success: {
      label: "Paid",
      style: "bg-green-100 text-green-800 border-green-200",
    },
  };

  const config = configs[status] || {
    label: status,
    style: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.style}`}
    >
      {config.label}
    </span>
  );
};

// --- 3. ANA BİLEŞEN ---
function InstructorPayment() {
  const {
    data: paymentStat,
    isFetching: isFetchingStat,
    isLoading: isLoadingPaymentStat,
    refetch: refetchPaymentStat,
  } = useQuery({
    queryKey: ["PaymentStat"],
    queryFn: instructorPanelService.getPaymentsStats,
  });

  const {
    data: paymentHistory,
    isFetching: isFetchingHistory,
    isLoading: isLoadingPaymentHistory,
    refetch: refetchPaymentHistory,
  } = useQuery({
    queryKey: ["PaymentHistory"],
    queryFn: () => instructorPanelService.getPaymentHistory(),
  });

  const isRefreshing = isFetchingStat || isFetchingHistory;
  const stats = paymentStat;
  const historyList = paymentHistory?.data?.data || [];

  // Loading State
  if (isLoadingPaymentStat || isLoadingPaymentHistory) {
    return (
      <div className="w-full h-[400px] bg-[#F5F5F5] rounded-3xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-auto bg-[#F5F5F5] rounded-3xl p-4 md:p-6 relative">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Payout & Earnings
          </h1>
          <p className="text-gray-500 text-sm">
            Track your income and view per-session rates.
          </p>
        </div>
        <button
          onClick={() => {
            refetchPaymentStat();
            refetchPaymentHistory();
          }}
          disabled={isRefreshing}
          className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600"
        >
          <RefreshCw
            className={`w-5 h-5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`}
          />
        </button>
      </div>

      {/* --- GRID LAYOUT (SOL: İSTATİSTİK & TABLO | SAĞ: KAZANÇ REHBERİ) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SOL KOLON (GENİŞ - 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. STATS KARTLARI (Mevcut kodun) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Pending */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  Pending
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {stats?.pending_balance || "0.00"}{" "}
                <span className="text-xs font-normal text-gray-500">TL</span>
              </div>
            </div>

            {/* This Month */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  This Month
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {stats?.this_month || "0.00"}{" "}
                <span className="text-xs font-normal text-gray-500">TL</span>
              </div>
            </div>

            {/* Total Paid */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <Wallet className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  Total Paid
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {stats?.total_paid || "0.00"}{" "}
                <span className="text-xs font-normal text-gray-500">TL</span>
              </div>
            </div>
          </div>

          {/* 2. GEÇMİŞ TABLOSU */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Payment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium text-right">Amount</th>
                    <th className="p-4 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {historyList.length > 0 ? (
                    historyList.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-4 text-gray-600 whitespace-nowrap">
                          {item.created_at}
                        </td>
                        <td className="p-4 text-gray-900">
                          <div className="font-medium">
                            {item.description || "Session Payment"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {item.note}
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-black">
                          {item.payment_method === "coupon" ? (
                            <span className="text-gray-400 line-through text-xs decoration-gray-400">
                              0.00 TL
                            </span>
                          ) : (
                            <span>{parseFloat(item.amount).toFixed(2)} TL</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-gray-500">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SAĞ KOLON (DAR - 1/3) - KAZANÇ REHBERİ */}
        <div className="lg:col-span-1">
          {/* GÖNDERDİĞİN SARI KART TASARIMI BURADA */}
          <div className="bg-[#FFD600] rounded-3xl p-6 text-black shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-6 opacity-80">
              <Info className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Instructor Rates
              </span>
            </div>

            <div className="space-y-4">
              {EARNING_TIERS.map((tier) => (
                <div
                  key={tier.count}
                  className="flex justify-between items-center group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xl opacity-90 group-hover:opacity-100 transition-opacity">
                      {tier.count}
                    </span>
                    <span className="font-medium text-lg opacity-80 group-hover:opacity-100">
                      student{tier.count > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="font-black text-2xl group-hover:scale-105 transition-transform">
                    {tier.amount} TL
                  </div>
                </div>
              ))}
              <p className="mt-2 text-xs font-medium opacity-60 leading-relaxed">
                *** Before taxes
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-black/10 text-xs font-medium opacity-60 leading-relaxed">
              * Earnings are calculated based on the number of confirmed
              students per session.
              <br />
              ** Rates are subject to change.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorPayment;
