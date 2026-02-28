import { useEffect, useRef } from "react";

export default function CryptoChart({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) container.current.innerHTML = "";

    let cleanSymbol = symbol.toUpperCase();

    const tradingViewSymbol =
      cleanSymbol === "USDT" ? "BINANCE:USDTUSD" : `BINANCE:${cleanSymbol}USDT`;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tradingViewSymbol, // <--- Usamos el símbolo procesado
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      enable_publishing: false,
      allow_symbol_change: true, // <--- Importante: permite al usuario buscar otra si falla
      support_host: "https://www.tradingview.com",
    });

    container.current?.appendChild(script);
  }, [symbol]);

  return (
    <div
      className="w-full h-full border border-slate-800 rounded-2xl overflow-hidden"
      ref={container}
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}
