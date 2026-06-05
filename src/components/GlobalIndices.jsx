export default function GlobalIndices({ indices }) {
    if (!indices?.length) return null;
  
    return (
      <div className="bg-gray-900 rounded-xl p-5">
        <h2 className="text-sm font-medium text-gray-400 mb-4">Global Indices</h2>
        <div className="space-y-3">
          {indices.map(idx => (
            <div key={idx.name} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-24 shrink-0">{idx.name}</span>
              <div className="flex-1 h-5 bg-gray-800 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all ${
                    idx.change_pct >= 0 ? "bg-emerald-500/70" : "bg-rose-500/70"
                  }`}
                  style={{ width: `${Math.min(Math.abs(idx.change_pct) * 20, 100)}%` }}
                />
              </div>
              <span className={`text-xs font-medium w-16 text-right ${
                idx.change_pct >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}>
                {idx.change_pct > 0 ? "+" : ""}{idx.change_pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }