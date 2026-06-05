import json
import yfinance as yf

SECTORS = {
    "Banks": ["HBL.KA", "MCB.KA", "UBL.KA"],
    "Energy": ["OGDC.KA", "PPL.KA", "PSO.KA", "MARI.KA"],
    "Cement": ["LUCK.KA"],
    "Food": ["NESTLE.KA", "ENGRO.KA"],
}

def handler(request):
    results = {}
    for sector, tickers in SECTORS.items():
        changes = []
        for symbol in tickers:
            try:
                t = yf.Ticker(symbol)
                info = t.fast_info
                if info.last_price and info.previous_close:
                    change = ((info.last_price - info.previous_close) / info.previous_close) * 100
                    changes.append(round(change, 2))
            except:
                pass
        results[sector] = round(sum(changes) / len(changes), 2) if changes else 0

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"sectors": results})
    }