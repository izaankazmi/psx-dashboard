import json
import yfinance as yf

PSX_TICKERS = [
    "HBL.KA", "OGDC.KA", "PPL.KA", "ENGRO.KA", "MCB.KA",
    "UBL.KA", "LUCK.KA", "PSO.KA", "MARI.KA", "NESTLE.KA"
]

def handler(request):
    results = []
    for symbol in PSX_TICKERS:
        try:
            t = yf.Ticker(symbol)
            info = t.fast_info
            results.append({
                "symbol": symbol.replace(".KA", ""),
                "price": round(float(info.last_price or 0), 2),
                "change_pct": round(float(
                    ((info.last_price - info.previous_close) / info.previous_close) * 100
                    if info.previous_close else 0
                ), 2),
                "volume": int(info.three_month_average_volume or 0)
            })
        except:
            pass
    
    results.sort(key=lambda x: abs(x["change_pct"]), reverse=True)
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"stocks": results[:10]})
    }