export default function TopMovers({ gainers, losers }) {
    const all = [
      ...gainers.map(s => ({ ...s, type: "gain" })),
      ...losers.map(s => ({ ...s, type: "loss" })),
    ].sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct));
  
    return (
      <div className="space-y-2">
        {all.map(s => (
          <div key={s.symbol} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-14 shrink-0 font-mono">
              {s.symbol}
            </span>
            <div className="flex-1 h-5 bg-gray-800 rounded overflow-hidden">
              <div
                className={`h-full rounded transition-all ${
                  s.type === "gain" ? "bg-emerald-500/70" : "bg-rose-500/70"
                }`}
                style={{ width: `${Math.min(Math.abs(s.change_pct) * 8, 100)}%` }}
              />
            </div>
            <span
              className={`text-xs font-medium w-14 text-right ${
                s.type === "gain" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {s.change_pct > 0 ? "+" : ""}{s.change_pct}%
            </span>
          </div>
        ))}
      </div>
    );
  }