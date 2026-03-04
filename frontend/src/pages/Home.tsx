import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      <NavBar />
      {/* Decoración de fondo: Luces difusas */}
      <div className="absolute  top-1/4 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/20 rounded-full blur-[120px]"></div>

      <main className="relative z-10 text-center px-6">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">
          Crypto<span className="text-cyan-500">Pulse</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Monitorea el mercado de criptomonedas en tiempo real con datos
          precisos y gráficos avanzados. Tu pulso financiero, en un solo lugar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* BOTÓN PRINCIPAL PARA IR A /COINS */}
          <Link
            to="/market"
            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Explorar Monedas
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-8 text-slate-600 text-sm font-mono">
        v1.0.0 • Powered by FastAPI & React
      </footer>
    </div>
  );
}
