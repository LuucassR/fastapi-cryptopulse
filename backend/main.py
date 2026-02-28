import requests
from coinpaprika.client import Client
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

free_client = Client()

# Calls to http://localhost:8000
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/coins")
def get_coins():
    try:
        all_coins = free_client.coins()
        return all_coins
    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}

    
@app.get("/coins/{coin_id}")
def get_coin(coin_id: str):
    try:
        coin = free_client.coin(coin_id)
        return coin
    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}


@app.get("/")
def home():
    try:
        response = requests.get("https://api.coinpaprika.com/v1/tickers/btc-bitcoin")
        data = response.json()
        return data

    except Exception as e:
        print(f"Error en el backend: {e}")
        return {"error": str(e)}


