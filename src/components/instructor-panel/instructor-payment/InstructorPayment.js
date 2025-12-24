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
} from "lucide-react";

// Helper component for Status Badges (Now fully English)
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

function InstructorPayment() {
  // 1. Stats Data
  const {
    data: paymentStat,
    error: errorPaymentStat,
    isLoading: isLoadingPaymentStat,
    refetch: refetchPaymentStat,
  } = useQuery({
    queryKey: ["PaymentStat"],
    queryFn: instructorPanelService.getPaymentsStats,
  });

  // 2. History Data
  const {
    data: paymentHistory,
    error: errorPaymentHistory,
    isLoading: isLoadingPaymentHistory,
    refetch: refetchPaymentHistory,
  } = useQuery({
    queryKey: ["PaymentHistory"],
    queryFn: () => instructorPanelService.getPaymentHistory(),
  });

  const stats = paymentStat?.data;
  const historyList = paymentHistory?.data?.data || [];

  // Loading State
  if (isLoadingPaymentStat || isLoadingPaymentHistory) {
    return (
      <div className="w-full h-auto bg-[#F5F5F5] rounded-3xl p-4 md:p-6 relative flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="text-gray-500 text-sm">
            Loading financial data...
          </span>
        </div>
      </div>
    );
  }

  // Error State
  if (errorPaymentStat || errorPaymentHistory) {
    return (
      <div className="w-full h-auto bg-[#F5F5F5] rounded-3xl p-4 md:p-6 relative flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-800">
            Failed to Load Data
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Your financial information cannot be displayed right now.
          </p>
          <button
            onClick={() => {
              refetchPaymentStat();
              refetchPaymentHistory();
            }}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-auto bg-[#F5F5F5] rounded-3xl p-4 md:p-6 relative">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payout</h1>
          <p className="text-gray-500 text-sm">
            Manage your financial status and payment history.
          </p>
        </div>
        <button
          onClick={() => {
            refetchPaymentStat();
            refetchPaymentHistory();
          }}
          className="p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all text-gray-600"
          title="Refresh Data"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* --- 1. STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1: Pending Balance */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-16 h-16 text-yellow-500" />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Pending Balance
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.pending_balance}{" "}
            <span className="text-sm font-normal text-gray-500">
              {stats?.currency}
            </span>
          </div>
        </div>

        {/* Card 2: Earnings This Month */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-16 h-16 text-blue-500" />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Earnings This Month
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.this_month}{" "}
            <span className="text-sm font-normal text-gray-500">
              {stats?.currency}
            </span>
          </div>
        </div>

        {/* Card 3: Total Paid */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-16 h-16 text-green-500" />
          </div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-500">
              Total Paid
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.total_paid}{" "}
            <span className="text-sm font-normal text-gray-500">
              {stats?.currency}
            </span>
          </div>
        </div>
      </div>

      {/* --- 2. PAYMENT HISTORY TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Payment History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium text-center">Status</th>
                <th className="p-4 font-medium text-center">Payment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {historyList.length > 0 ? (
                historyList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {item.created_at}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {/* Backend might send Turkish description, but generic ones can be handled here if needed */}
                      {item.description}
                      {item.note && (
                        <div className="text-xs text-gray-400 font-normal mt-0.5">
                          {item.note}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right font-bold text-gray-900 whitespace-nowrap">
                      {parseFloat(item.amount).toFixed(2)}{" "}
                      <span className="text-xs font-normal text-gray-500">
                        {item.currency}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-4 text-center text-gray-500 whitespace-nowrap">
                      {item.paid_at || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="bg-gray-100 p-3 rounded-full">
                        <Clock className="w-6 h-6 text-gray-400" />
                      </div>
                      <p>No payment records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {paymentHistory?.data?.next_page_url && (
          <div className="p-4 border-t border-gray-100 text-center">
            <span className="text-xs text-gray-400">
              Change page to see more records
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default InstructorPayment;
