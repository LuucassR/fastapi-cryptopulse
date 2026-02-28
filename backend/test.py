import requests

url = 'https://api.coinpaprika.com/v1/tickers/btc-bitcoin'

response = requests.get('https://api.coinpaprika.com/v1/tickers/btc-bitcoin')
coin_price = response.json()["quotes"]["USD"]["price"]

print(f"${round(coin_price, 2)}")