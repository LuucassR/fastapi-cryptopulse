import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api";

export default function NavBar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCash, setUserCash] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/my-portfolio`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch portfolio");

      const data = await response.json();
      setUserCash(data.cash);
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchPortfolio();
    }

    // Verificamos si hay un usuario guardado al cargar el componente
    const savedName = localStorage.getItem("user_name");
    const savedEmail = localStorage.getItem("user_email");
    if (savedName || savedEmail) {
      setUserName(savedName);
      setUserEmail(savedEmail);
    }
  }, []);

  const formattedCash = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(userCash ?? 0);

  // Eliminamos de las cookies el token junto con el email y el usaername y luego recargamos
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    setUserName(null);
    setUserEmail(null);
    window.location.reload(); // Recargamos para limpiar estados globales
  };

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-slate-950/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-linear-to-br from-[#00d2ff] to-[#9d50bb] rounded-lg shadow-lg shadow-cyan-500/20"></div>
            <Link
              to="/"
              className="text-white font-bold text-xl tracking-tight"
            >
              Crypto<span className="text-[#00d2ff]">Pulse</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/market"
              className="text-gray-300 hover:text-[#00d2ff] text-sm font-medium transition-colors"
            >
              Market
            </Link>
            <Link
              to="/portfolio"
              className="text-gray-300 hover:text-[#00d2ff] text-sm font-medium transition-colors"
            >
              Portfolio
            </Link>

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {userName || userEmail ? (
              /* ESTADO: LOGUEADO */
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full">
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">
                    Balance
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {formattedCash}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400">Bienvenido,</span>
                  <span className="text-white font-bold text-sm">
                    {userName || userEmail}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 text-white px-4 py-2 rounded-xl text-xs font-medium transition-all"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              /* ESTADO: NO LOGUEADO */
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-linear-to-r from-[#00d2ff] to-[#9d50bb] text-white px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-cyan-500/10"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
