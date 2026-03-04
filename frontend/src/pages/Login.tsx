import { useState } from "react";
import NavBar from "../components/NavBar";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [usernameOrPassword, setUsernameOrPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginParams = new URLSearchParams();
      const identifier = usernameOrPassword ? formData.username : formData.email;
      loginParams.append("username", identifier);
      loginParams.append("password", formData.password);

      const response = await fetch("https://fastapi-cryptopulse-qoh3-git-main-luucassrs-projects.vercel.app/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: loginParams,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error al iniciar sesión");
      }

      // Guardamos Token y Nombre en el navegador
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_name", data.full_name || formData.username);
      localStorage.setItem("user_email", data.email || formData.email);

      window.location.href = "/"; // Redirección para refrescar el Navbar
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen w-screen bg-slate-950 text-white p-6">
      <NavBar />
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md border border-white/20 w-full max-w-md self-center rounded-3xl p-10 shadow-2xl flex flex-col gap-6"
      >
        <div className="text-center">
          <h2 className="text-white text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm">
            Enter your credentials to access your pulse
          </p>
        </div>

        {usernameOrPassword ? (
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-medium ml-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Elon_Pulse"
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] transition-all"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label
              className="text-gray-300 text-sm font-medium ml-1"
              htmlFor="username"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Elon@tesla.com"
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] transition-all"
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            className="text-gray-300 text-sm font-medium ml-1"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#9d50bb] focus:ring-1 focus:ring-[#9d50bb] transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-linear-to-r from-[#00d2ff] to-[#9d50bb] text-white font-bold rounded-xl p-4 hover:opacity-90 hover:scale-[1.01] active:scale-95 transition-all shadow-lg shadow-cyan-500/20 flex justify-center items-center gap-3"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : null}
          {loading ? "Verificando..." : "Sign In"}
        </button>

        {usernameOrPassword ? (
          <button
            onClick={(e) => {
              (setUsernameOrPassword(!usernameOrPassword), e.preventDefault());
            }}
            className="text-center hover:cursor-pointer hover:underline text-white/60 font-medium"
          >
            Sign-In with password
          </button>
        ) : (
          <button
            onClick={(e) => {
              (setUsernameOrPassword(!usernameOrPassword), e.preventDefault());
            }}
            className="text-center hover:cursor-pointer hover:underline text-white/60 font-medium"
          >
            Sign-In with username
          </button>
        )}
        <p className="text-center text-gray-500 text-xs mt-2 italic">
          🔒 Secure encrypted login
        </p>
      </form>
    </div>
  );
}
