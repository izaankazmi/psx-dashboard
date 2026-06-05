const INDICES = [
    { symbol: '%5EGSPC', name: 'S&P 500' },
    { symbol: '%5EFTSE', name: 'FTSE 100' },
    { symbol: '%5EN225', name: 'Nikkei 225' },
  ];
  
  async function getIndex(symbol, name) {
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const data = await response.json();
      const result = data?.chart?.result?.[0];
      if (!result) return null;
  
      const closes = result.indicators?.quote?.[0]?.close?.filter(Boolean) || [];
      if (closes.length < 2) return null;
  
      const current = closes[closes.length - 1];
      const prev = closes[closes.length - 2];
      const change_pct = Math.round(((current - prev) / prev) * 10000) / 100;
  
      return {
        name,
        price: Math.round(current * 100) / 100,
        change_pct
      };
    } catch (e) {
      return null;
    }
  }
  
  export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      const results = await Promise.all(INDICES.map(i => getIndex(i.symbol, i.name)));
      res.json({ indices: results.filter(Boolean) });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }