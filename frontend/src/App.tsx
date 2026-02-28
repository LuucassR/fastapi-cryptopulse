import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Coin from "./pages/Coin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coins" element={<Dashboard />} />
        <Route path="/coins/:coinId" element={<Coin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
