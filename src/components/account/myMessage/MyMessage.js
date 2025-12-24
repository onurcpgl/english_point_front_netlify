"use client";
import React, { useState } from "react";
import generalService from "../../../utils/axios/generalService";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  Bell,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

export default function MyMessage() {
  const [markingId, setMarkingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["myMessage"],
    queryFn: generalService.getMessage,
  });

  const formatDate = (dateString) => {
    const options = {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("tr-TR", options);
  };

  const handleMarkAsRead = async (id) => {
    if (!id) return;
    setMarkingId(id);
    try {
      await generalService.getMessageAsMarker(id);
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingId(null);
    }
  };

  const allNotifications = data?.data || [];
  const unreadCount = allNotifications.filter((n) => !n.read_at).length;

  // --- PAGINATION MANTIĞI ---
  const totalPages = Math.ceil(allNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotifications = allNotifications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // --- SKELETON LOADER ---
  if (isLoading) {
    return (
      <div className="flex flex-col w-full max-w-full overflow-hidden bg-[#F5F5F5] p-10 max-lg:p-4 h-auto rounded-3xl relative min-h-[600px]">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6 animate-pulse">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 gap-5 mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse"
            >
              <div className="flex flex-col md:flex-row gap-4 w-full">
                {/* İkon */}
                <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0"></div>

                {/* İçerik */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden bg-[#F5F5F5] p-10 max-lg:p-4 h-auto rounded-3xl relative min-h-[600px]">
      {/* BAŞLIK ALANI */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
          <p className="text-gray-600 mt-1">
            Eğitim süreçlerinizle ilgili güncellemeler
          </p>
        </div>
        <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
          {unreadCount} Okunmamış
        </div>
      </div>

      {/* BİLDİRİM LİSTESİ */}
      <div className="grid grid-cols-1 gap-5 mt-2">
        {allNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <Bell size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Bildirim Yok</h3>
            <p className="text-gray-500 mt-2">
              Şu anda size ait yeni bir bildirim bulunmuyor.
            </p>
          </div>
        ) : (
          currentNotifications.map((item) => {
            const isUnread = item.read_at === null;

            return (
              <div
                key={item.id}
                className={`group relative p-5 border-b last:border-b-0 transition-all duration-200 hover:bg-gray-50 ${
                  isUnread ? "bg-blue-50/40" : "bg-white"
                }`}
              >
                <div className="flex gap-4">
                  {/* SOL İKON & DURUM */}
                  <div className="relative shrink-0 mt-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isUnread
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isUnread ? (
                        <Bell size={18} />
                      ) : (
                        <CheckCircle size={18} />
                      )}
                    </div>
                    {/* Okunmamışsa Kırmızı Nokta */}
                    {isUnread && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>

                  {/* İÇERİK */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3
                        className={`text-base ${
                          isUnread
                            ? "font-bold text-gray-900"
                            : "font-medium text-gray-600"
                        }`}
                      >
                        {item.data.title}
                      </h3>
                      <span className="shrink-0 text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed pr-8">
                      {item.data.message}
                    </p>

                    {/* AKSİYONLAR (Sadece Unread ise gösterir) */}
                    {isUnread && (
                      <div className="pt-2">
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          disabled={markingId === item.id}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
                        >
                          {markingId === item.id ? (
                            "İşleniyor..."
                          ) : (
                            <>
                              <CheckCircle size={12} /> Okundu olarak işaretle
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- PAGINATION --- */}
      {allNotifications.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-gray-200/50">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border flex items-center gap-1 transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 border-transparent cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:block">Önceki</span>
          </button>

          <span className="text-sm font-bold text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg border flex items-center gap-1 transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 border-transparent cursor-not-allowed"
                : "bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black"
            }`}
          >
            <span className="text-sm font-medium hidden sm:block">Sonraki</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
