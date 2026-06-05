export default function MarketBreadth({ stocks }) {
    if (!stocks?.length) return null;
  
    const advances = stocks.filter(s => s.change_pct > 0).length;
    const declines = stocks.filter(s => s.change_pct < 0).length;
    const unchanged = stocks.filter(s => s.change_pct === 0).length;
    const total = stocks.length;
    const advancePct = Math.round((advances / total) * 100);
  
    return (
      <div className="bg-gray-900 rounded-xl p-5">
        <h2 className="text-sm font-medium text-gray-400 mb-4">Market Breadth</h2>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-emerald-400 font-medium">{advances} Advancing</span>
          {unchanged > 0 && <span className="text-gray-500">{unchanged} Unchanged</span>}
          <span className="text-rose-400 font-medium">{declines} Declining</span>
        </div>
        <div className="h-4 bg-gray-800 rounded overflow-hidden flex">
          <div
            className="h-full bg-emerald-500/80 transition-all"
            style={{ width: `${advancePct}%` }}
          />
          <div
            className="h-full bg-rose-500/80 transition-all"
            style={{ width: `${100 - advancePct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2 text-gray-500">
          <span>{advancePct}% advancing</span>
          <span>{total} stocks tracked</span>
        </div>
      </div>
    );
  }