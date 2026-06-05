const SECTORS = [
    { name: "Banks", tickers: ["HBL", "MCB", "UBL"] },
    { name: "Energy", tickers: ["OGDC", "PPL", "PSO", "MARI"] },
    { name: "Cement", tickers: ["LUCK"] },
    { name: "Food", tickers: ["NESTLE", "ENGRO"] },
  ];
  
  export default function SectorHeatmap({ stocks }) {
    const bySymbol = Object.fromEntries(stocks.map(s => [s.symbol, s]));
  
    const sectors = SECTORS.map(sec => {
      const matched = sec.tickers.map(t => bySymbol[t]).filter(Boolean);
      const avg = matched.length
        ? matched.reduce((sum, s) => sum + s.change_pct, 0) / matched.length
        : 0;
      return { ...sec, avg: +avg.toFixed(2) };
    });
  
    const colorClass = (v) => {
      if (v > 2)  return "bg-emerald-500 text-emerald-900";
      if (v > 0)  return "bg-emerald-900/60 text-emerald-300";
      if (v > -2) return "bg-rose-900/60 text-rose-300";
      return "bg-rose-600 text-rose-100";
    };
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sectors.map(sec => (
          <div
            key={sec.name}
            className={`rounded-lg p-4 text-center ${colorClass(sec.avg)}`}
          >
            <p className="text-sm font-semibold">{sec.name}</p>
            <p className="text-2xl font-bold mt-1">
              {sec.avg > 0 ? "+" : ""}{sec.avg}%
            </p>
            <p className="text-xs opacity-70 mt-1">{sec.tickers.length} stocks</p>
          </div>
        ))}
      </div>
    );
  }