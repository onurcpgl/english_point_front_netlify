import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import generalServiceFonk from "../../src/services/generalService";
import { MapPin, Coffee } from "lucide-react";

export default function RecentOrders() {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await generalServiceFonk.getGoogleCafes();
        const cafeList = response.data?.data?.data || response.data?.data || [];
        setCafes(cafeList.slice(0, 5));
      } catch (error) {
        console.error("Kafeler yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 shadow-sm">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Eğitmenlerin Tercih Ettiği Kafeler
          </h3>
          <p className="text-xs text-gray-500">En çok oturum düzenlenen lokasyonlar</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/google-cafes" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-theme-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            Tümünü Gör
          </a>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-bold text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Kafe Adı
              </TableCell>
              <TableCell isHeader className="py-3 font-bold text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Şehir / İlçe
              </TableCell>
              <TableCell isHeader className="py-3 font-bold text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Google ID
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {cafes.map((cafe) => (
              <TableRow key={cafe.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 shrink-0 overflow-hidden rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/20">
                      <Coffee size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-theme-sm dark:text-white/90">
                        {cafe.name}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="text-blue-500" />
                    <span className="text-theme-sm font-medium">
                      {/* DÜZELTME: Veri boşsa kontrol et */}
                      {cafe.city || "Şehir Belirtilmemiş"}
                      {cafe.district ? ` / ${cafe.district}` : ""}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-4 text-gray-500 text-xs font-mono dark:text-gray-500">
                  {cafe.google_place_id?.substring(0, 15)}...
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

        {cafes.length === 0 && (
          <div className="text-center py-10 text-gray-500 italic">
            Henüz kafe verisi bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}