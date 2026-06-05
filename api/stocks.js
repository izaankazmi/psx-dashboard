const TICKERS = ['HBL.KA','OGDC.KA','PPL.KA','ENGRO.KA','MCB.KA','UBL.KA','LUCK.KA','PSO.KA','MARI.KA'];

async function getQuote(symbol) {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    const data = await response.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const closes = result.indicators?.quote?.[0]?.close || [];
    const volumes = result.indicators?.quote?.[0]?.volume || [];
    
    // Filter out null values
    const validCloses = closes.filter(c => c !== null && c !== undefined);
    if (validCloses.length < 2) return null;

    const current = validCloses[validCloses.length - 1];
    const prev = validCloses[validCloses.length - 2];
    const change_pct = Math.round(((current - prev) / prev) * 10000) / 100;
    const validVolumes = volumes.filter(v => v !== null && v !== undefined);

    return {
      symbol: symbol.replace('.KA', ''),
      price: Math.round(current * 100) / 100,
      change_pct,
      volume: validVolumes[validVolumes.length - 1] || 0
    };
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const results = await Promise.all(TICKERS.map(getQuote));
    const stocks = results
      .filter(Boolean)
      .sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct));
    res.json({ stocks });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}