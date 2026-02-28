import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Coin } from "../types";
import CryptoChart from "../components/CryptoChart";
import "../global.css";

export default function Coin() {
  const [coin, setCoin] = useState<Coin>();
  const { coinId } = useParams();

  useEffect(() => {
    const getCoin = async (coin_id: string) => {
      try {
        const response = await fetch(`http://localhost:8000/coins/${coin_id}`);
        const data = await response.json();
        setCoin(data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };
    if (coinId) getCoin(coinId);
  }, [coinId]);

  if (!coin) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center">
      <Link
        to="/coins"
        className="absolute self-start mb-8 text-slate-400 hover:text-cyan-400 transition-colors"
      >
        ← Volver al Dashboard
      </Link>

      <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl max-w-md w-full text-center">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20"></div>
          <img
            src={coin.logo}
            loading="lazy"
            alt={`${coin.name} Logo`}
            className="relative w-24 h-24 mx-auto drop-shadow-2xl"
          />
        </div>

        <h1 className="text-4xl font-black mb-1">{coin.name}</h1>
        <span className="text-cyan-500 font-mono text-xl">{coin.symbol}</span>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <p className="text-xs text-slate-500 uppercase">Ranking</p>
            <p className="text-2xl font-bold">#{coin.rank}</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl">
            <p className="text-xs text-slate-500 uppercase">Activa</p>
            <p className="text-2xl font-bold text-green-400">
              {coin.is_active ? "Sí" : "No"}
            </p>
          </div>
        </div>

        <p className="mt-8 text-slate-400 text-sm leading-relaxed">
          {coin.description ||
            "No hay descripción disponible para esta moneda."}
        </p>
      </div>

      <div className="w-[calc(100vw-60px)] h-200 gap-8 p-4">
        <CryptoChart symbol={coin.symbol} />
      </div>
    </div>
  );
}
