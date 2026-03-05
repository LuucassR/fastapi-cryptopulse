import os
from dotenv import load_dotenv
import requests
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import jwt
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pwdlib import PasswordHash
from coinpaprika.client import Client
from backend.db.query import get_user_by_id, create_user, get_user_by_identifier
from backend.db.models import (
    UserRegister,
    UserTable,
    UserAsset,
    CryptoTable,
    AddAssetSchema,
    Token,
)

# Cargamos la carpeta .env para utilizarla
load_dotenv()

# Obtenemos las claves de la carpeta .env
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
DATABASE_URL = os.getenv("DATABASE_URL")

# Tiempo de expiracion del token
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Creamos el engine que va a ser lo que vamos a utilizar para interactuar con la base de datos
engine = create_engine(str(DATABASE_URL), echo=True)

# Generamos un nuevo objeto de session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Funcion para obtener la base de datos y eliminar el resto
def get_db():
    db = SessionLocal()  # Usa la clase Session que ya definiste con sessionmaker
    try:
        yield db
    finally:
        db.close()


# Creamos el app para utilizar los decorators con fastApi
app = FastAPI()

# Declaramos el cliente de coinpaprika para el request de la API
free_client = Client()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
password_hash = PasswordHash.recommended()

# Declaramos las CORS para que los fetchs sean aceptadas en estas rutas
# Estas rutas son de development cambiar luego para production
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://fastapi-cryptopulse-qoh3-git-main-luucassrs-projects.vercel.app/",
    "https://fastapi-cryptopulse-qoh3.vercel.app/"
]

# Utilizamos los middlewares para aceptar los CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- UTILIDADES DE SEGURIDAD ---
DUMMY_HASH = password_hash.hash("dummypassword")


# Creamos una funcion para comparar la contraseña del usuario con el password hasheado en la DB
def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


# Creamos uina funcion para crear un token de acceso
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    # Tiempo de expiracion
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    # le asignamos el tiempo de expiracion al token
    to_encode.update({"exp": expire})

    # JWT = Javascript Web Token

    # Ciframos el Token
    encoded_jwt = jwt.encode(to_encode, str(SECRET_KEY), algorithm=ALGORITHM)
    return encoded_jwt


# Creamos una funcion para obtener el usuario de la sesion
async def get_current_user(
    # Toma de valores el token del usuario y la base de datos la cual se obtiene con "get_db"
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db),  # <--- También necesitamos la DB aquí
):
    # Error por si fallan las credenciales
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    #
    try:
        payload = jwt.decode(token, str(SECRET_KEY), algorithms=[str(ALGORITHM)])
        username: str | None = payload.get("sub")
        if username is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception

    user = get_user_by_identifier(db, identifier=username)

    if user is None:
        raise credentials_exception
    return user


# --- RUTAS DE TESTEO ---
@app.get("/test")
def test():
    return free_client.markets("btc-bitcoin", quotes="USD")[1]["quotes"]["USD"]["price"]


# --- RUTAS DE AUTENTICACIÓN ---
@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),  # <--- Inyectamos la DB aquí
) -> Token:
    # 1. Buscamos al usuario en la base de datos real
    user = get_user_by_identifier(db, form_data.username)

    # 2. Validamos existencia y contraseña
    if not user:
        # Ejecutamos un hash dummy para prevenir ataques de timing
        verify_password(form_data.password, DUMMY_HASH)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(
        form_data.password, user.password
    ):  # 'user.password' es el hash en la DB
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Generamos el token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


# --- RUTAS DE CRIPTOMONEDAS ---
@app.get("/")
def get_btc_ticker():
    """Retorna datos básicos de BTC usando requests."""
    try:
        response = requests.get("https://api.coinpaprika.com/v1/tickers/btc-bitcoin")
        return response.json()
    except Exception as e:
        return {"error": str(e)}


@app.get("/coins")
def get_coins():
    """Lista todas las monedas usando Coinpaprika Client."""
    try:
        return free_client.coins()
    except Exception as e:
        return {"error": str(e)}


@app.get("/coins/{coin_id}")
async def get_coin(coin_id: str):
    try:
        coin_data = free_client.coin(coin_id)
        market_data = free_client.markets(coin_id, quotes="USD")
        current_price = market_data[0]["quotes"]["USD"]["price"]

        return {**coin_data, "quotes": {"USD": {"price": current_price}}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error API: {str(e)}")


@app.get("/api/get/user/{user_id}")
async def get_user_api(user_id: int, db: Session = Depends(get_db)):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/api/create/user")
async def create_new_user(data: UserRegister, db: Session = Depends(get_db)):
    hashed = password_hash.hash(data.password)

    try:
        new_user = create_user(
            db,
            full_name=data.full_name,
            username=data.username,
            email=data.email,
            password=hashed,
        )
        return {"message": "User created successfully", "username": data.username}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/my-portfolio")
async def get_my_portfolio(
    current_user: Annotated[UserTable, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    user_assets = db.query(UserAsset).filter(UserAsset.user_id == current_user.id).all()

    assets_list = []
    for asset in user_assets:
        try:
            # Usamos .ticker() que es más directo para obtener precio y cambios
            # Según los ejemplos: free_client.ticker("btc-bitcoin")
            ticker_info = free_client.ticker(asset.crypto_id)

            # Estructura de coinpaprika: ticker_info['quotes']['USD']['price']
            quotes = ticker_info.get("quotes", {}).get("USD", {})
            current_price = quotes.get("price", 0)
            change_24h = quotes.get("percent_change_24h", 0)

            total_value = float(current_price) * float(asset.amount)

            assets_list.append(
                {
                    "id": asset.id,
                    "name": asset.crypto_info.name,
                    "crypto_id": asset.crypto_id,
                    "symbol": asset.crypto_info.symbol,
                    "amount": float(asset.amount),
                    "logo": asset.crypto_info.logo,
                    "total_value_usd": total_value,
                    "percent_change_24h": float(change_24h),
                }
            )
        except Exception as e:
            print(f"Error cargando datos para {asset.crypto_id}: {e}")
            continue

    return {
        "cash": float(current_user.cash),
        "assets": assets_list,
    }


@app.post("/api/portfolio/add")
async def add_to_portfolio(
    data: AddAssetSchema,
    current_user: Annotated[UserTable, Depends(get_current_user)],
    db: Session = Depends(get_db),
):
    current_price = data.current_price
    total_cost = float(data.amount) * float(current_price)

    # 2. Verificar si el usuario tiene dinero suficiente
    if float(current_user.cash) < total_cost:
        raise HTTPException(
            status_code=400,
            detail=f"Saldo insuficiente. Costo: ${total_cost}, Tienes: ${current_user.cash}",
        )

    # 3. Restar el dinero al usuario
    current_user.cash = float(current_user.cash) - total_cost

    # 4. Lógica de Criptos (la que ya tienes)
    crypto = db.query(CryptoTable).filter(CryptoTable.id == data.crypto_id).first()
    if not crypto:
        crypto = CryptoTable(
            id=data.crypto_id,
            symbol=data.symbol,
            name=data.name,
            market_rank=data.rank,
            logo=data.logo,
        )
        db.add(crypto)

    # 5. Actualizar o crear el Asset
    asset = (
        db.query(UserAsset)
        .filter(
            UserAsset.user_id == current_user.id, UserAsset.crypto_id == data.crypto_id
        )
        .first()
    )

    if asset:
        asset.amount = float(asset.amount) + float(data.amount)
    else:
        new_asset = UserAsset(
            user_id=current_user.id, crypto_id=data.crypto_id, amount=data.amount
        )
        db.add(new_asset)

    db.commit()
    return {"message": "Compra exitosa", "new_cash": current_user.cash}
