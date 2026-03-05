import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Coins } from "../types";
import DashboardSkeleton from "../ui/DashboardSkeleton";
import NavBar from "../components/NavBar";
import { API_URL } from "../api";

export default function Market() {
  const [loading, setLoading] = useState<boolean>(true);
  const [coins, setCoins] = useState<Coins[]>([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/coins`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const all_coins = await response.json();

        if (isMounted) {
          if (Array.isArray(all_coins)) {
            setCoins(all_coins);
          } else {
            throw new Error("Formato de datos inválido");
          }
        }
      } catch (error: any) {
        if (isMounted) setError(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCoins = (coins || []).filter(
    (coin) =>
      coin.name?.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-950 text-white p-8">
      <NavBar />
      <header className="text-center">
        <h1 className="text-4xl mt-14 font-extrabold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Crypto Pulse
        </h1>
      </header>

      <nav className="flex flex-col justify-center p-10">
        <h2 className="text-center text-xl font-bold text-gray-300">
          Search Your Currency
        </h2>
        <input
          type="text"
          placeholder="Buscar por nombre o símbolo..."
          className="w-fit self-center m-4 bg-slate-900 border border-slate-800 py-3 px-6 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all text-slate-200 placeholder:text-slate-600 shadow-2xl"
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>

      <p className="text-slate-400 mt-2 text-center mb-2 font-bold text-xl">
        Top 20 Cryptocurrencies
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {loading ? (
          <DashboardSkeleton quantity={20} />
        ) : error ? (
          <div className="col-span-full text-center p-10 bg-red-900/20 border border-red-500/50 rounded-2xl">
            <p className="text-red-400 font-bold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm underline"
            >
              Reintentar
            </button>
          </div>
        ) : (
          filteredCoins.slice(0, visibleCount).map((coin) => (
            <Link
              to={`/coins/${coin.id}`}
              key={coin.id}
              className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300 shadow-xl"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest">
                    #{coin.rank}
                  </span>
                  <h2 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">
                    {coin.name}
                  </h2>
                </div>
                <div className="bg-slate-800 p-2 rounded-lg text-sm font-bold text-slate-300">
                  {coin.symbol}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      {visibleCount < filteredCoins.length && (
        <button
          onClick={() => setVisibleCount((prev) => prev + 50)}
          className="mt-8 px-6 py-2 bg-slate-800 rounded-full mx-auto block"
        >
          Cargar más monedas...
        </button>
      )}
    </div>
  );
}
