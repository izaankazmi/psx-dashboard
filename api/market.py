import json
import yfinance as yf

def handler(request):
    try:
        ticker = yf.Ticker("^KSE")
        hist = ticker.history(period="30d", interval="1d")
        
        data = []
        for date, row in hist.iterrows():
            data.append({
                "date": date.strftime("%b %d"),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"]),
                "change": round(float(row["Close"] - row["Open"]), 2)
            })
        
        current = data[-1] if data else {}
        prev = data[-2] if len(data) > 1 else {}
        
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "history": data,
                "current_price": current.get("close", 0),
                "daily_change_pct": round(
                    ((current.get("close", 0) - prev.get("close", 1)) / prev.get("close", 1)) * 100, 2
                )
            })
        }
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}