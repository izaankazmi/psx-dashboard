const TICKERS = ['HBL.KA','OGDC.KA','PPL.KA','ENGRO.KA','MCB.KA','UBL.KA','LUCK.KA','PSO.KA','MARI.KA'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const symbols = TICKERS.join(',');
    const response = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`
    );
    const data = await response.json();
    const quotes = data.quoteResponse.result;

    const stocks = quotes.map(q => ({
      symbol: q.symbol.replace('.KA', ''),
      price: Math.round(q.regularMarketPrice * 100) / 100,
      change_pct: Math.round(q.regularMarketChangePercent * 100) / 100,
      volume: q.regularMarketVolume
    })).sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct));

    res.json({ stocks });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}