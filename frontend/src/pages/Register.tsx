import { useState } from "react";
import type { formRegisterData } from "../types";
import { redirect } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Login() {
  const [formData, setFormData] = useState<formRegisterData>({
    full_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [userCreated, setUserCreated] = useState<boolean>(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await fetch("https://fastapi-cryptopulse-qoh3.vercel.app/api/create/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Detalles del error de FastAPI:", errorData);
        alert("Error: " + (errorData.detail || "Error desconocido"));
      } else {
        setFormData({ full_name: "", username: "", email: "", password: "" });
      }
      setUserCreated(true)
      setTimeout(() => {
        redirect("/")
      }, 3000)
    } catch (err) {
      console.error("Error de red:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center h-screen w-screeen bg-slate-950 text-white p-16">
      <NavBar />
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md border border-white/20 w-full max-w-md self-center rounded-3xl p-10 shadow-2xl flex flex-col gap-6"
      >
        <h2 className="text-white text-2xl font-bold text-center mb-2">
          Welcome Back
        </h2>

        <div className="flex flex-col gap-2">
          <label
            className="text-gray-300 text-sm font-medium ml-1"
            htmlFor="username"
          >
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Morty Smith"
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] transition-all placeholder:text-gray-500"
          />
        </div>

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
            value={formData.username}
            onChange={handleChange}
            placeholder="Elon_Pulse"
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] transition-all placeholder:text-gray-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-gray-300 text-sm font-medium ml-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#00d2ff] focus:ring-1 focus:ring-[#00d2ff] transition-all placeholder:text-gray-500"
          />
        </div>

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
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#9d50bb] focus:ring-1 focus:ring-[#9d50bb] transition-all placeholder:text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading} // Evita múltiples clics
          className="flex justify-center items-center p-4 rounded-2xl mt-4 bg-linear-to-r from-[#00d2ff] to-[#9d50bb] ..."
        >
          {loading && ( // 3. El SVG solo aparece si loading es true
            <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
              {/* Tu SVG de carga aquí */}
            </svg>
          )}
          {loading ? "Creando..." : "Sign In"}
        </button>
        {userCreated && <p className="text-green-500 font-medium font-sm">User Created Successfully</p> }

        <p className="text-center text-gray-400 text-xs mt-2">
          Protected by CryptoPulse Encryption
        </p>
      </form>
    </div>
  );
}
