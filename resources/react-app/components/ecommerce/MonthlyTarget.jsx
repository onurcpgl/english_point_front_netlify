import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import generalServiceFonk from "../../src/services/generalService";

export default function MonthlyTarget() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ratio: 0,
    totalQuota: 0,
    registered: 0,
    waiting: 0,
  });

  useEffect(() => {
    const fetchSessionStats = async () => {
      try {
        const response = await generalServiceFonk.getCourseSessions();
        const sessions = response.data?.data || response.data || [];

        const totalQuota = sessions.reduce((acc, s) => acc + (s.quota || 0), 0);
        const registered = sessions.reduce(
          (acc, s) => acc + (s.registered_count || 0),
          0
        );
        const waiting = sessions.filter((s) => s.status === "awaiting").length;

        const ratio = totalQuota > 0 ? (registered / totalQuota) * 100 : 0;

        setStats({
          ratio: parseFloat(ratio.toFixed(2)),
          totalQuota,
          registered,
          waiting,
        });
      } catch (error) {
        console.error("İstatistik hatası:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionStats();
  }, []);

  const series = [stats.ratio];

  const options = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#FFFFFF",
            formatter: (val) => val + "%",
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Doluluk"],
  };

  // --- SKELETON GÖRÜNÜMÜ ---
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
        <div className="px-5 pt-5 pb-11 sm:px-6 sm:pt-6">
          <div className="space-y-3">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          </div>
          <div className="flex justify-center mt-10">
            <div className="w-52 h-52 rounded-full border-8 border-gray-200 dark:border-gray-800 border-b-transparent"></div>
          </div>
          <div className="mt-12 space-y-2 flex flex-col items-center">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-8 px-6 py-5 border-t border-gray-200 dark:border-gray-800">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-12"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 shadow-default rounded-2xl pb-11 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Genel Doluluk Oranı</h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              Tüm oturumların toplam kontenjan doluluğu
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="max-h-[330px] text-white" id="chartDarkStyle">
            <Chart options={options} series={series} type="radialBar" height={330} />
          </div>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] text-white rounded-full bg-success-500/15 px-3 py-1 text-xs font-medium text-success-500">
            {stats.ratio > 50 ? "Yüksek Talep" : "Normal"}
          </span>
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          Şu ana kadar toplam <strong>{stats.registered}</strong> öğrenci kaydı alındı. Kapasite kullanımınız şahane!
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5 border-t border-gray-200 dark:border-gray-800">
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Kapasite</p>
          <p className="text-base font-semibold text-white sm:text-lg">{stats.totalQuota}</p>
        </div>

        <div className="w-px bg-gray-200 dark:bg-gray-800 h-7"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Kayıtlı</p>
          <p className="text-base font-semibold text-green-500 sm:text-lg">{stats.registered}</p>
        </div>

        <div className="w-px bg-gray-200 dark:bg-gray-800 h-7"></div>

        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">Bekleyen</p>
          <p className="text-base font-semibold text-yellow-500 sm:text-lg">{stats.waiting}</p>
        </div>
      </div>
    </div>
  );
}