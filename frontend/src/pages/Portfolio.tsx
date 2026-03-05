import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingDots from "../components/LoadingDots";
import type { Asset } from "../types"; // Asumo que tienes el tipo Asset definido en types.ts
import { API_URL } from "../api";

export default function Portfolio() {
  const [assets, setAssets] = useState<Asset[] | null>(null);
  const [cash, setCash] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/my-portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch portfolio");

      const result = await response.json();
      setAssets(result.assets);
      setCash(result.cash);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // --- CÁLCULOS DINÁMICOS GLOBALES ---

  // Crypto Equity: Suma del valor actual de todas las monedas usando el estado 'assets'
  const cryptoEquity =
    assets?.reduce((acc, asset) => acc + (asset.total_value_usd || 0), 0) || 0;

  // Net Worth: Cash disponible (estado 'cash') + Valor de las criptos
  const netWorth = (cash || 0) + cryptoEquity;

  // Cambio Total 24h (USD): Suma ponderada de cuánto ha ganado/perdido cada moneda
  const totalChangeUSD =
    assets?.reduce((acc, asset) => {
      const currentVal = asset.total_value_usd || 0;
      const prevVal = currentVal / (1 + asset.percent_change_24h / 100);
      return acc + (currentVal - prevVal);
    }, 0) || 0;

  // Porcentaje de cambio del Portfolio total
  const portfolioPercentChange =
    cryptoEquity > 0 ? (totalChangeUSD / cryptoEquity) * 100 : 0;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col relative overflow-x-hidden">
      <NavBar />

      <main className="flex-1 pt-24 pb-12 px-6 max-w-7xl mx-auto w-full flex flex-col gap-8">
        {/* DASHBOARD DE BALANCES */}
        <header className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta de Cash */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">
              Available Cash
            </span>
            <h2 className="text-3xl font-mono text-green-400 mt-2">
              {/* Usamos el estado cash directamente */}
              {loading ? (
                <LoadingDots color="bg-green-400" />
              ) : (
                formatCurrency(cash || 0)
              )}
            </h2>
            <p className="text-[10px] text-gray-500 mt-1">Ready to invest</p>
          </div>

          {/* Tarjeta de Crypto Equity */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">
              Crypto Equity
            </span>
            <h2 className="text-3xl font-mono text-cyan-400 mt-2">
              {loading ? (
                <LoadingDots color="bg-cyan-400" />
              ) : (
                formatCurrency(cryptoEquity)
              )}
            </h2>
            {!loading && cryptoEquity > 0 && (
              <div
                className={`flex items-center gap-1 text-sm font-bold mt-1 ${totalChangeUSD >= 0 ? "text-green-400" : "text-red-400"}`}
              >
                {totalChangeUSD >= 0 ? "↑" : "↓"}
                {formatCurrency(Math.abs(totalChangeUSD))} (
                {Math.abs(portfolioPercentChange).toFixed(2)}%)
                <span className="text-[10px] text-gray-500 ml-1 font-normal uppercase">
                  24h
                </span>
              </div>
            )}
          </div>

          {/* Tarjeta de Net Worth */}
          <div className="bg-linear-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
            <span className="text-xs text-white/60 uppercase font-bold tracking-widest relative z-10">
              Net Worth
            </span>
            <h2 className="text-4xl font-mono text-white mt-2 relative z-10">
              {loading ? (
                <LoadingDots color="bg-white" />
              ) : (
                formatCurrency(netWorth)
              )}
            </h2>
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <div className="w-12 h-12 rounded-full bg-cyan-400 blur-xl"></div>
            </div>
          </div>
        </header>

        {/* TABLA DE ACTIVOS (ASSETS) */}
        <section className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold text-xl text-gray-200">Your Assets</h3>
            {loading && (
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-xs text-gray-400 uppercase bg-white/5">
                <tr>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Current Value</th>
                  <th className="px-6 py-4">24h Change</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Iteramos sobre el estado 'assets' */}
                {assets && assets.length > 0
                  ? assets.map((asset) => {
                      const currentVal = asset.total_value_usd || 0;
                      const prevVal =
                        currentVal / (1 + asset.percent_change_24h / 100);
                      const assetChangeUSD = currentVal - prevVal;

                      return (
                        <tr
                          key={asset.id}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img
                              src={asset.logo} 
                              alt={asset.name}
                              className="w-10 h-10 rounded-full bg-white/10 p-1"
                            />
                            <div>
                              <p className="font-medium text-gray-100">
                                {asset.name}
                              </p>
                              <p className="text-xs text-gray-500 uppercase">
                                {asset.symbol}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4 font-mono text-gray-300">
                            {asset.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 8,
                            })}
                            <span className="text-[10px] opacity-50 ml-1">
                              {asset.symbol}
                            </span>
                          </td>

                          <td className="px-6 py-4 font-bold text-white">
                            {formatCurrency(currentVal)}
                          </td>

                          <td
                            className={`px-6 py-4 font-bold ${asset.percent_change_24h >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                {asset.percent_change_24h >= 0 ? "↑" : "↓"}
                                {Math.abs(asset.percent_change_24h).toFixed(2)}%
                              </div>
                              <span className="text-[10px] opacity-70 font-mono">
                                {assetChangeUSD >= 0 ? "+" : "-"}
                                {formatCurrency(Math.abs(assetChangeUSD))}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/coins/${asset.crypto_id}`}
                              className="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-3 py-2 rounded-lg hover:bg-cyan-400/20 transition-all"
                            >
                              Trade
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  : !loading && (
                      <tr>
                        <td colSpan={5} className="text-center py-20">
                          <p className="text-gray-500 mb-4 text-lg">
                            Your portfolio is empty.
                          </p>
                          <Link
                            to="/market"
                            className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 rounded-full hover:bg-cyan-500/20 transition-all font-bold inline-block"
                          >
                            Explore Market →
                          </Link>
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
    </div>
  );
}
