from typing import Optional

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import (
    ForeignKey,
    String,
    Numeric,
    Integer,
    Boolean,
    Text,
)
from sqlalchemy.orm import DeclarativeBase  # Para las bases de SQLalchemy
from pydantic import BaseModel  # Para las classes de fastApi


# Creamos la base de las futuras clases de SQLAlchemy
class Base(DeclarativeBase):
    pass


# Creamos la tabla de usuario
class UserTable(Base):
    __tablename__ = "user"  # Nombre de esta en nuestra base de datos

    # Definimos los tipos como en la base de datos

    # nombre: Mapped[tipo] = mapped_column(propiedades)
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(nullable=False)
    username: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    cash: Mapped[float] = mapped_column(nullable=False, default=10000.0)
    portfolio: Mapped[list["UserAsset"]] = relationship(back_populates="owner")

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, username={self.username!r})"


# Definimos la clase UserRegister, donde estos seran los datos que ingrese el usuario para registrarse
class UserRegister(BaseModel):  # Debe ser BaseModel, no Base ya que es para FastAPI
    full_name: str
    username: str
    email: str
    password: str


# La API respondera con esto o alguno de esos
class UserSchema(BaseModel):  # Para respuestas de la API
    username: str
    email: str | None = None
    full_name: str | None = None


# Declaramos la clase CryptoTable
class CryptoTable(Base):
    __tablename__ = "cryptos"

    # Todos los objetos que contienen una moneda
    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    symbol: Mapped[str] = mapped_column(String(20), nullable=False)
    market_rank: Mapped[int] = mapped_column(Integer, nullable=True)
    is_new: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    type: Mapped[str] = mapped_column(String(50), nullable=True)
    logo: Mapped[str] = mapped_column(Text, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    holders: Mapped[list["UserAsset"]] = relationship(back_populates="crypto_info")


# Declaramos la clase Para las crypto que tiene el usuario
class UserAsset(Base):
    __tablename__ = "user_assets"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"))
    crypto_id: Mapped[str] = mapped_column(ForeignKey("cryptos.id", ondelete="CASCADE"))
    amount: Mapped[float] = mapped_column(Numeric(precision=20, scale=8), default=0)

    # Relaciones
    owner: Mapped["UserTable"] = relationship(back_populates="portfolio")
    crypto_info: Mapped["CryptoTable"] = relationship(back_populates="holders")


# La clase que vamos a utilizar para añadir cryptos al usuario
class AddAssetSchema(BaseModel):
    crypto_id: str
    amount: float
    symbol: str
    name: str
    rank: int
    logo: str
    current_price: float


# Declaramos la clase de la base de la crypto, esto es basicamente la respuesta de la API ante una mooneda
class CryptoBase(BaseModel):
    id: str
    name: str
    symbol: str
    rank: int
    is_new: bool
    is_active: bool
    type: str
    logo: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

# Creamos la clase del token
class Token(BaseModel):
    access_token: str
    token_type: str
