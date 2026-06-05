import { useState, useEffect } from "react";
import IndexChart from "./components/IndexChart";
import TopMovers from "./components/TopMovers";
import StatCard from "./components/StatCard";
import SectorHeatmap from "./components/SectorHeatmap";

const REFRESH_MS = 60_000;

export default function Dashboard() {
  const [market, setMarket] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [mRes, sRes] = await Promise.all([
        fetch("/api/market"),
        fetch("/api/stocks"),
      ]);
      const mData = await mRes.json();
      const sData = await sRes.json();
      setMarket(mData);
      setStocks(sData.stocks || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  const gainers = stocks.filter(s => s.change_pct > 0).slice(0, 5);
  const losers  = stocks.filter(s => s.change_pct < 0).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            PSX Market Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Pakistan Stock Exchange · Live data
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : "Connecting…"}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading market data…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="KSE-100 Index"
              value={market?.current_price?.toLocaleString() ?? "—"}
              sub="PKR"
            />
            <StatCard
              label="Daily Change"
              value={`${market?.daily_change_pct > 0 ? "+" : ""}${market?.daily_change_pct ?? 0}%`}
              positive={market?.daily_change_pct >= 0}
            />
            <StatCard label="Active Stocks" value={stocks.length} sub="tracked" />
            <StatCard
              label="Top Gainer"
              value={gainers[0] ? `${gainers[0].symbol} +${gainers[0].change_pct}%` : "—"}
              positive
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2 bg-gray-900 rounded-xl p-5">
              <h2 className="text-sm font-medium text-gray-400 mb-4">
                KSE-100 · 30-Day Trend
              </h2>
              <IndexChart data={market?.history ?? []} />
            </div>
            <div className="bg-gray-900 rounded-xl p-5">
              <h2 className="text-sm font-medium text-gray-400 mb-4">
                Top Movers Today
              </h2>
              <TopMovers gainers={gainers} losers={losers} />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-400 mb-4">
              Sector Performance
            </h2>
            <SectorHeatmap stocks={stocks} />
          </div>
        </>
      )}
    </div>
  );
}