import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import generalServiceFonk from "../../src/services/generalService";
import { Calendar, TrendingUp } from "lucide-react";

export default function MonthlySalesChart() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [totalYearly, setTotalYearly] = useState(0);
  const [peakMonth, setPeakMonth] = useState("-");

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const response = await generalServiceFonk.getUsers();
        const users = response.data?.data || response.data || [];

        // 12 aylık boş bir dizi oluştur (Ocak-Aralık)
        const monthlyCounts = new Array(12).fill(0);
        const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

        users.forEach((user) => {
          if (user.created_at) {
            const date = new Date(user.created_at);
            const month = date.getMonth(); // 0-11 arası döner
            monthlyCounts[month] += 1;
          }
        });

        // İstatistikleri hesapla
        const total = monthlyCounts.reduce((a, b) => a + b, 0);
        const maxVal = Math.max(...monthlyCounts);
        const maxMonthIndex = monthlyCounts.indexOf(maxVal);

        setChartData(monthlyCounts);
        setTotalYearly(total);
        setPeakMonth(total > 0 ? monthNames[maxMonthIndex] : "-");
      } catch (error) {
        console.error("Grafik verisi işlenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  const series = [{ name: "Yeni Kayıtlar", data: chartData }];

  const options = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        gradientToColors: ["#7e3af2"],
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#64748b", fontSize: "11px" } },
    },
    yaxis: {
      labels: { style: { colors: "#64748b", fontSize: "11px" } },
    },
    grid: { borderColor: "#e2e8f0", strokeDashArray: 4, yaxis: { lines: { show: true } } },
    tooltip: { theme: "dark" },
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-10"></div>
        <div className="flex items-end justify-between gap-2 h-32">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-t-md w-full h-16"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={18} className="text-blue-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">Kayıt Analizi</h3>
          </div>
          <p className="text-xs text-gray-500">Kullanıcıların aylık kayıt dağılımı</p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="-ml-4 min-w-[600px] xl:min-w-full">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 py-4 mt-2 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">En Yoğun Ay</p>
          <p className="text-sm font-bold text-gray-800 dark:text-white">{peakMonth}</p>
        </div>
        <div className="text-center border-l border-gray-100 dark:border-gray-800">
          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Toplam Kayıt</p>
          <p className="text-sm font-bold text-blue-600">{totalYearly}</p>
        </div>
      </div>
    </div>
  );
}