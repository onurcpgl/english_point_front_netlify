"use client";
import React, { useState } from "react";
import generalService from "../../../utils/axios/generalService";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Check,
  Inbox,
  Clock,
  ChevronDown,
} from "lucide-react";

export default function MyMessage() {
  const [markingId, setMarkingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null); // Hangi mesajın açık olduğunu tutar
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myMessage"],
    queryFn: generalService.getMessage,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
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

  const handleToggleMessage = async (item) => {
    const isUnread = item.read_at === null;

    // Eğer zaten açıksa kapat
    if (expandedId === item.id) {
      setExpandedId(null);
      return;
    }

    // Mesajı aç
    setExpandedId(item.id);

    // Eğer okunmamışsa, açıldığı an okundu olarak işaretle
    if (isUnread) {
      setMarkingId(item.id);
      try {
        await generalService.getMessageAsMarker(item.id);
        await refetch();
      } catch (err) {
        console.error("Okundu işaretlenemedi:", err);
      } finally {
        setMarkingId(null);
      }
    }
  };

  const allNotifications = data?.data || [];
  const unreadCount = allNotifications.filter((n) => !n.read_at).length;

  const totalPages = Math.ceil(allNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotifications = allNotifications.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (isLoading)
    return (
      <div className="p-10 animate-pulse bg-white rounded-3xl h-[500px]"></div>
    );

  return (
    <div className="flex flex-col w-full max-w-full overflow-hidden bg-[#F5F5F5] p-10 max-lg:p-2 h-auto rounded-3xl relative">
      {/* BAŞLIK */}
      <div className="flex justify-between items-center mb-8 px-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Mesajlar
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            {unreadCount > 0
              ? `${unreadCount} yeni bildirim`
              : "Tüm süreçler güncel"}
          </p>
        </div>
        <div className="bg-[#fdd207] text-black w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm">
          <Bell size={24} />
        </div>
      </div>

      {/* MESAJ LİSTESİ */}
      <div className="space-y-4">
        {allNotifications.length === 0 ? (
          <div className="bg-white rounded-[32px] p-20 text-center shadow-sm">
            <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800">
              Bildirim bulunmuyor
            </h3>
          </div>
        ) : (
          currentNotifications.map((item) => {
            const isUnread = item.read_at === null;
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleToggleMessage(item)}
                className={`group relative bg-white rounded-[24px] transition-all duration-500 cursor-pointer shadow-sm border-2 overflow-hidden ${
                  isUnread
                    ? "border-[#fdd207]"
                    : "border-transparent opacity-90"
                }`}
              >
                {/* ÜST ALAN (Her zaman görünür) */}
                <div className="p-6 flex items-center gap-5">
                  {/* DURUM İKONU */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isUnread
                        ? "bg-yellow-50 text-[#fdd207]"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    {isUnread ? (
                      <Bell size={20} className="animate-pulse" />
                    ) : (
                      <Check size={20} />
                    )}
                  </div>

                  {/* BAŞLIK VE TARİH */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`truncate text-lg ${isUnread ? "font-bold text-black" : "font-semibold text-gray-600"}`}
                    >
                      {item.data.title}
                    </h3>
                    <div className="flex items-center text-gray-400 gap-1.5 mt-0.5">
                      <Clock size={12} />
                      <span className="text-[11px] font-medium uppercase tracking-wider">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* AÇ/KAPAT OKU */}
                  <div
                    className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  >
                    <ChevronDown size={20} className="text-gray-400" />
                  </div>
                </div>

                {/* ALT ALAN (Sadece tıklandığında açılır) */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    isExpanded
                      ? "max-h-40 opacity-100 pb-6 px-6"
                      : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="pt-4 border-t border-gray-50">
                    <p className="text-gray-700 text-sm leading-relaxed bg-[#F9F9F9] p-4 rounded-xl border border-gray-100">
                      {item.data.message}
                    </p>
                  </div>
                </div>

                {/* YENİ ETİKETİ */}
                {isUnread && (
                  <span className="absolute top-4 right-14 bg-black text-[#fdd207] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                    YENİ
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION */}
      {allNotifications.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (currentPage > 1) setCurrentPage(currentPage - 1);
            }}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl border-2 border-gray-100 bg-white flex items-center justify-center hover:border-black transition-all disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-50">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
            }}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl border-2 border-gray-100 bg-white flex items-center justify-center hover:border-black transition-all disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
