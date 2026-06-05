export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      // Fetch PKR/USD rate
      const pkrRes = await fetch(
        'https://query1.finance.yahoo.com/v8/finance/chart/PKR=X?interval=1d&range=7d',
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const pkrData = await pkrRes.json();
      const pkrCloses = pkrData?.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.filter(Boolean) || [];
      const pkrRate = pkrCloses[pkrCloses.length - 1];
      const pkrPrev = pkrCloses[pkrCloses.length - 2];
      const pkrChange = pkrPrev ? Math.round(((pkrRate - pkrPrev) / pkrPrev) * 10000) / 100 : 0;
  
      res.json({
        pkr_usd: Math.round(pkrRate * 100) / 100,
        pkr_change: pkrChange
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }