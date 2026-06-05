export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
      const response = await fetch(
        'https://query1.finance.yahoo.com/v8/finance/chart/%5EKSE?interval=1d&range=30d',
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const data = await response.json();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }