"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Company } from "@/lib/types/company.types";
import {
  getStockQuote,
  getStockCandles,
  StockQuote,
} from "@/lib/api/finance.api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [chartData, setChartData] = useState<{
    prices: number[];
    dates: string[];
  }>({ prices: [], dates: [] });
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [quote, candles] = await Promise.all([
          getStockQuote(company.ticker),
          getStockCandles(company.ticker, timeframe),
        ]);

        setStockData(quote);

        if (candles.timestamp) {
          setChartData({
            prices: candles.close.filter((price) => price !== null),
            dates: candles.timestamp.map((timestamp: number) =>
              new Date(timestamp * 1000).toLocaleDateString()
            ),
          });
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Failed to fetch stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, [company.ticker, timeframe]);

  const recommendationColor = {
    Buy: "text-green-400",
    Hold: "text-yellow-400",
    Sell: "text-red-400",
  }[company.investmentThesis.recommendation];

  const formatPercentage = (value: number) => {
    const formatted = Math.abs(value).toFixed(2);
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-400" : "text-red-400";
  };

  const getChartColor = (change: number) => {
    return change >= 0
      ? { border: "#4ade80", background: "rgba(74, 222, 128, 0.1)" }
      : { border: "#ef4444", background: "rgba(239, 68, 68, 0.1)" };
  };

  return (
    <motion.div
      className="relative p-6 bg-gray-800/50 backdrop-blur-lg rounded-xl hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {loading ? (
        <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-4">{error}</div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">{company.name}</h2>
              <p className="text-gray-400">{company.ticker}</p>
            </div>
            {stockData && (
              <div className="text-right">
                <div className="text-xl font-bold text-white">
                  ${stockData.regularMarketPrice.toFixed(2)}
                </div>
                <div
                  className={`text-sm ${getChangeColor(
                    stockData.regularMarketChangePercent
                  )}`}
                >
                  {stockData.regularMarketChangePercent >= 0 ? "↑" : "↓"}{" "}
                  {formatPercentage(stockData.regularMarketChangePercent)}%
                  <span className="text-xs ml-1 text-gray-400">
                    (${Math.abs(stockData.regularMarketChange).toFixed(2)})
                  </span>
                </div>
              </div>
              
            )}
          </div>

          <div className="flex w-full gap-2 mb-4">
              {["week", "month", "year"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period as "week" | "month" | "year")}
                  className={`px-3 py-1 text-xs rounded-md ${
                    timeframe === period ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>

          <div className="h-32 bg-gray-700/30 rounded-lg overflow-hidden mb-4">
            {chartData.prices.length > 0 && stockData && (
              <Line
                data={{
                  labels: chartData.dates,
                  datasets: [
                    {
                      label: company.ticker,
                      data: chartData.prices,
                      borderColor: getChartColor(
                        stockData.regularMarketChangePercent
                      ).border,
                      backgroundColor: getChartColor(
                        stockData.regularMarketChangePercent
                      ).background,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      mode: "index",
                      intersect: false,
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      titleColor: "white",
                      bodyColor: "white",
                      borderColor: "rgba(74, 222, 128, 0.2)",
                      borderWidth: 1,
                    },
                  },
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                    },
                  },
                  interaction: {
                    intersect: false,
                    mode: "index",
                  },
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-sm text-gray-400">Risk Level</span>
              <div
                className={`mt-1 px-2 py-1 rounded-full text-xs inline-block ${
                  company.investmentThesis.riskAssessment.level === "High"
                    ? "bg-red-500/20 text-red-300"
                    : company.investmentThesis.riskAssessment.level ===
                      "Moderate"
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "bg-green-500/20 text-green-300"
                }`}
              >
                {company.investmentThesis.riskAssessment.level}
              </div>
            </div>

            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-sm text-gray-400">Recommendation</span>
              <div className={`mt-1 font-semibold ${recommendationColor}`}>
                {company.investmentThesis.recommendation}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">
                Expected Return
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">
                  {company.investmentThesis.expectedReturn.value}%
                </span>
                <span className="text-sm text-gray-400">
                  in {company.investmentThesis.expectedReturn.timeframe}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">
                Key Drivers
              </h3>
              <div className="flex flex-wrap gap-2">
                {company.investmentThesis.keyDrivers.map((driver, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-700/30 rounded-full text-xs text-gray-300"
                  >
                    {driver}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
