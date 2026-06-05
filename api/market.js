export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      const response = await fetch(
        'https://query1.finance.yahoo.com/v8/finance/chart/%5EKSE?interval=1d&range=30d'
      );
      const data = await response.json();
      const timestamps = data.chart.result[0].timestamp;
      const closes = data.chart.result[0].indicators.quote[0].close;
  
      const history = timestamps.map((ts, i) => ({
        date: new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        close: Math.round(closes[i] * 100) / 100
      })).filter(d => d.close);
  
      const current = history[history.length - 1];
      const prev = history[history.length - 2];
      const daily_change_pct = prev
        ? Math.round(((current.close - prev.close) / prev.close) * 10000) / 100
        : 0;
  
      res.json({ history, current_price: current.close, daily_change_pct });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }