"use client";
import React, { useEffect, useState } from "react";
import generalService from "../../../utils/axios/generalService";
import {
  CreditCard,
  RefreshCcw,
  XCircle,
  Ticket,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- SKELETON (YÜKLENİYOR) BİLEŞENİ ---
const SkeletonItem = () => (
  <div className="bg-white rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between border border-gray-100 animate-pulse mb-4">
    <div className="flex items-center gap-4 w-full md:w-auto">
      <div className="w-14 h-14 bg-gray-200 rounded-2xl shrink-0"></div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2.5"></div>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="h-3 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
    <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end w-full md:w-auto">
      <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sayfalama State'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // currentPage değiştiğinde API'ye istek at
  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const fetchHistory = async (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Sayfa değiştiğinde yukarı kaydır
    setLoading(true);
    try {
      const response = await generalService.getTransactionHistory(page);
      if (response && response.status) {
        setTransactions(response.data); // Veriler
        setTotalPages(response.pagination.last_page); // Toplam sayfa sayısı
      }
    } catch (error) {
      console.error("İşlem geçmişi alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };

  const getConfig = (item) => {
    switch (item.history_type) {
      case "payment":
        return {
          icon: <CreditCard size={24} className="text-blue-600" />,
          bgConfig: "bg-blue-50",
          badgeText: item.method === "coupon" ? "KUPON" : "KART",
          badgeColor: "bg-blue-100 text-blue-700",
          amountColor: "text-gray-900",
          amountPrefix: "-",
        };
      case "refund":
        return {
          icon: <RefreshCcw size={24} className="text-green-600" />,
          bgConfig: "bg-green-50",
          badgeText: "İADE",
          badgeColor: "bg-green-100 text-green-700",
          amountColor: "text-green-600",
          amountPrefix: "+",
        };
      case "cancellation":
        return {
          icon:
            item.status === "approved" ? (
              <CheckCircle size={24} className="text-orange-500" />
            ) : (
              <XCircle size={24} className="text-red-500" />
            ),
          bgConfig: item.status === "approved" ? "bg-orange-50" : "bg-red-50",
          badgeText: item.status === "approved" ? "ONAYLANDI" : "REDDEDİLDİ",
          badgeColor:
            item.status === "approved"
              ? "bg-orange-100 text-orange-700"
              : "bg-red-100 text-red-700",
          amountColor: "text-gray-400",
          amountPrefix: "",
        };
      case "coupon":
        return {
          icon: <Ticket size={24} className="text-yellow-600" />,
          bgConfig: "bg-yellow-50",
          badgeText: item.status === "used" ? "KULLANILDI" : "AKTİF",
          badgeColor:
            item.status === "used"
              ? "bg-gray-100 text-gray-600"
              : "bg-yellow-100 text-yellow-700",
          amountColor: "text-gray-900",
          amountPrefix: "",
        };
      default:
        return {
          icon: <AlertCircle size={24} className="text-gray-500" />,
          bgConfig: "bg-gray-100",
          badgeText: "BİLGİ",
          badgeColor: "bg-gray-200 text-gray-700",
          amountColor: "text-gray-900",
          amountPrefix: "",
        };
    }
  };

  return (
    <div className="bg-[#f8f9fa] rounded-[32px] p-6 md:p-10 w-full min-h-[600px] shadow-sm flex flex-col">
      {/* BAŞLIK */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          İşlem Geçmişim
        </h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Satın alımlarınız, iadeleriniz ve iptal süreçleriniz
        </p>
      </div>

      {/* İÇERİK */}
      <div className="flex-1 space-y-4">
        {loading ? (
          /* Yüklenirken 4 tane Skeleton gösterelim */
          [...Array(4)].map((_, i) => <SkeletonItem key={i} />)
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-700">
              Henüz bir işleminiz yok
            </h3>
          </div>
        ) : (
          transactions.map((item, index) => {
            const config = getConfig(item);
            return (
              <div
                key={`${item.history_type}-${item.id}-${index}`}
                className="bg-white rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between border border-gray-100 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div
                    className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${config.bgConfig}`}
                  >
                    {config.icon}
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${config.badgeColor}`}
                      >
                        {config.badgeText}
                      </span>
                      <span className="text-xs font-medium text-gray-500">
                        {item.session_name !== "Genel" ? item.session_name : ""}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                  <div className="text-xs text-gray-400 md:mb-1 font-medium">
                    {formatDate(item.date)}
                  </div>
                  {item.amount !== null && Number(item.amount) > 0 && (
                    <div
                      className={`text-lg md:text-xl font-black ${config.amountColor}`}
                    >
                      {config.amountPrefix}
                      {Number(item.amount).toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      TL
                    </div>
                  )}
                  {item.amount !== null && Number(item.amount) === 0 && (
                    <div className="text-sm font-bold text-gray-500">
                      Ücretsiz
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SAYFALAMA (PAGINATION) - Sadece birden fazla sayfa varsa göster */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-sm font-bold text-gray-700 px-4">
            Sayfa {currentPage} / {totalPages}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Transactions;
