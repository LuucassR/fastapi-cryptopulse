import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Coin } from "../types";
import CryptoChart from "../components/CryptoChart";
import "../global.css";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

export default function Coin() {
  const [coin, setCoin] = useState<Coin>();
  const [amount, setAmount] = useState<number>(0);
  const [isAdding, setIsAdding] = useState(false);
  const { coinId } = useParams();
  const navigate = useNavigate();

  const addCrypto = async () => {
    const assetData = {
      crypto_id: coin?.id,
      name: coin?.name,
      symbol: coin?.symbol,
      rank: coin?.rank,
      is_new: coin?.is_new,
      is_active: coin?.is_active,
      type: coin?.type,
      logo: coin?.logo,
      description: coin?.description,
      current_price: coin?.quotes?.USD.price,
      amount: parseFloat(String(amount)),
    };

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para añadir activos.");
      return navigate("/login");
    }
    setIsAdding(true);

    try {
      const response = await fetch("https://fastapi-cryptopulse-qoh3-git-main-luucassrs-projects.vercel.app/api/portfolio/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(assetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Detalle del error:", errorData.detail);
        throw new Error("Error al añadir activo");
      }

      alert(`¡${coin?.name} añadido a tu portfolio!`);
    } catch (error: any) {
      console.error("Error:", error);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    const getCoin = async (coin_id: string) => {
      try {
        const response = await fetch(`http://localhost:8080/coins/${coin_id}`);
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
    <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-x-hidden">
      <NavBar />

      <Link
        to="/market"
        className="fixed top-24 left-8 z-10 flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-all font-medium group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">
          ←
        </span>
        Volver al Dashboard
      </Link>

      <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 px-6 pt-32 pb-12 max-w-400 mx-auto w-full">
        <aside className="w-full max-w-md flex flex-col gap-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full"></div>

            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img
                src={coin.logo}
                loading="lazy"
                alt={`${coin.name} Logo`}
                className="relative w-20 h-20 mx-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              />
            </div>

            <div className="flex gap-4 items-center justify-center">
              <h1 className="text-4xl font-black mb-1 tracking-tight">
                {coin.name}
              </h1>
              <span className="bg-cyan-500/10 text-cyan-400 px-4 py-1 rounded-full font-mono text-sm border border-cyan-500/20">
                {coin.symbol}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 p-1 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  Ranking
                </p>
                <p className="text-2xl font-black text-white">#{coin.rank}</p>
              </div>
              <div className="bg-white/5 border border-white/5 p-1 rounded-2xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  Estado
                </p>
                <p
                  className={`text-xl font-bold ${coin.is_active ? "text-green-400" : "text-red-400"}`}
                >
                  {coin.is_active ? "Activa" : "Inactiva"}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <label className="block text-[10px] text-slate-500 uppercase font-black mb-4 tracking-tighter">
                Añadir al Portfolio
              </label>
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.00000001"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full bg-slate-950/50 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all text-center font-mono text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">
                    {coin.symbol}
                  </span>
                </div>

                <button
                  onClick={addCrypto}
                  disabled={isAdding || isNaN(amount) || amount <= 0}
                  className="w-full bg-linear-to-r from-[#00d2ff] to-[#9d50bb] text-white font-bold rounded-2xl p-4 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-cyan-500/10 disabled:opacity-30 disabled:grayscale disabled:scale-100 flex justify-center items-center gap-3"
                >
                  {isAdding && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {isAdding ? "Procesando..." : `Añadir ${coin.name}`}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-4xl backdrop-blur-md">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">
              Sobre este activo
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed text-left">
              {coin.description ||
                "No hay descripción detallada disponible para este activo en este momento."}
            </p>
          </div>
        </aside>

        <section className="flex-1 w-full bg-slate-900/30 border border-white/10 rounded-[2.5rem] p-4 lg:p-8 min-h-125 lg:min-h-175 flex flex-col shadow-inner">
          <div className="mb-6 flex justify-between items-center px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              Market Chart
            </h2>
            <div className="flex gap-2">
              <span className="text-[10px] bg-white/5 px-3 py-1 rounded-md text-slate-400">
                LIVE DATA
              </span>
            </div>
          </div>

          <div className="flex h-[70vh]">
            <CryptoChart symbol={coin.symbol} />
          </div>
        </section>
      </div>

      <div className="fixed top-0 right-0 w-125 h-125 bg-purple-600/5 blur-[120px] rounded-full -z-10"></div>
      <div className="fixed bottom-0 left-0 w-125 h-125 bg-cyan-600/5 blur-[120px] rounded-full -z-10"></div>
    </div>
  );
}
