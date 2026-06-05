export default function CurrencyBar({ data }) {
    if (!data) return null;
    const positive = data.pkr_change <= 0;
  
    return (
      <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">PKR / USD</p>
          <p className="text-xl font-semibold text-gray-100">
            {data.pkr_usd} <span className="text-sm text-gray-400">PKR per $1</span>
          </p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${positive ? "text-emerald-400" : "text-rose-400"}`}>
            {data.pkr_change > 0 ? "+" : ""}{data.pkr_change}%
          </p>
          <p className="text-xs text-gray-500 mt-1">vs yesterday</p>
        </div>
      </div>
    );
  }