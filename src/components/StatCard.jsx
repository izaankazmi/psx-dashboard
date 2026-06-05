export default function StatCard({ label, value, sub, positive }) {
    const isPositive = positive === true;
    const isNegative = positive === false;
    return (
      <div className="bg-gray-900 rounded-xl p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-xl font-semibold ${
          isPositive ? "text-emerald-400" :
          isNegative ? "text-rose-400" :
          "text-gray-100"
        }`}>
          {value}
        </p>
        {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
      </div>
    );
  }