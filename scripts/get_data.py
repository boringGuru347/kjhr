import requests as req
import pandas as pd

def func():
    url = "https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream"
    r = req.get(url, params={"publishDateTimeFrom": "2025-12-25T00:00:00Z", "publishDateTimeTo":"2026-01-31T23:59:59Z"})
    js = r.json()
    df = pd.DataFrame(js)
    df.to_csv("windfor_data", index=True)
if __name__ == "__main__":
    func()