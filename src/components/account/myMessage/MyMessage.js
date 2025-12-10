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
                className={`relative rounded-2xl p-6 border transition-all duration-300 ${
                  isUnread
                    ? "bg-white border-gray-100 shadow-sm hover:shadow-md"
                    : "bg-[#EAEAEA] border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex flex-col md:flex-row items-start gap-4">
                  {/* İKON ALANI */}
                  <div
                    className={`p-3 h-fit rounded-xl shrink-0 ${
                      isUnread
                        ? "bg-blue-50 text-blue-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isUnread ? (
                      <Bell className="w-6 h-6" />
                    ) : (
                      <CheckCircle className="w-6 h-6" />
                    )}
                  </div>

                  {/* İÇERİK ALANI */}
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h3
                        className={`text-lg font-bold ${
                          isUnread ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {item.data.title}
                      </h3>
                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 bg-gray-100/50 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    <p
                      className={`text-sm mt-2 leading-relaxed ${
                        isUnread ? "text-gray-600" : "text-gray-500"
                      }`}
                    >
                      {item.data.message}
                    </p>

                    {/* BUTONLAR */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100/50">
                      {/* Detaya Git Butonu */}
                      {/* {item.data.action_url && (
                        <a
                          href={item.data.action_url}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg transition-colors border border-gray-200"
                        >
                          <BookOpen className="w-4 h-4" />
                          Detaya Git
                        </a>
                      )} */}

                      {/* Okundu İşaretle Butonu */}
                      {isUnread && (
                        <button
                          onClick={() => handleMarkAsRead(item.id)}
                          disabled={markingId === item.id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg transition-colors border border-blue-100 ml-auto"
                        >
                          {markingId === item.id ? (
                            <>
                              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                              İşleniyor
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Okundu İşaretle
                            </>
                          )}
                        </button>
                      )}
                    </div>
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
