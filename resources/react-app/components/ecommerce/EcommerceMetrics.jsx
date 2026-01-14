import React, { useEffect, useState } from "react";
import generalServiceFonk from "../../src/services/generalService";
import { Users, CalendarCheck, ArrowUpRight } from "lucide-react";

export default function EcommerceMetrics() {
  const [counts, setCounts] = useState({
    users: 0,
    activeSessions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        // İki isteği aynı anda paralel olarak başlatıyoruz (performans için)
        const [usersRes, sessionsRes] = await Promise.all([
          generalServiceFonk.getUsers(),
          generalServiceFonk.getCourseSessions(),
        ]);

        // Kullanıcı sayısı (Pagination varsa data.data, yoksa direkt data içindedir)
        const totalUsers = usersRes.data?.data?.length || usersRes.data?.length || 0;

        // Aktif Oturum Sayısı Filtreleme
        const allSessions = sessionsRes.data?.data || sessionsRes.data || [];
        const activeCount = allSessions.filter(
          (session) => session.status === "active"
        ).length;

        setCounts({
          users: totalUsers,
          activeSessions: activeCount,
        });
      } catch (error) {
        console.error("Metrikler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* --- Toplam Kullanıcı --- */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl dark:bg-blue-500/20">
          <Users size={24} />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Toplam Kullanıcı
            </span>
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md mt-2 dark:bg-gray-700"></div>
            ) : (
              <h4 className="mt-2 font-bold text-gray-900 text-2xl dark:text-white">
                {counts.users.toLocaleString()}
              </h4>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl dark:bg-emerald-500/20">
          <CalendarCheck size={24} />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Aktif Eğitimler
            </span>
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md mt-2 dark:bg-gray-700"></div>
            ) : (
              <h4 className="mt-2 font-bold text-gray-900 text-2xl dark:text-white">
                {counts.activeSessions}
              </h4>
            )}
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase font-bold mb-1">Durum</span>
            <span className="text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/20">
              Güncel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}