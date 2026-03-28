"use client";

import { useState } from "react";
import { buyCryptoAsset } from "@/app/actions/walletActions";
import { useRouter } from "next/navigation";

const AVAILABLE_ASSETS = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin", price: 65000 },
  { id: "ethereum", symbol: "eth", name: "Ethereum", price: 3500 },
  { id: "solana", symbol: "sol", name: "Solana", price: 150 },
];

export default function TradeWidget({ maxUsd }: { maxUsd: number }) {
  const router = useRouter();
  const [selectedAsset, setSelectedAsset] = useState(AVAILABLE_ASSETS[0]);
  const [usdAmount, setUsdAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(usdAmount);
    if (isNaN(amount) || amount <= 0) {
      setStatus("error");
      setMessage("Enter a valid USD amount.");
      return;
    }
    if (amount > maxUsd) {
      setStatus("error");
      setMessage("Insufficient Fiat Balance.");
      return;
    }

    setStatus("loading");
    const res = await buyCryptoAsset(selectedAsset.id, selectedAsset.symbol, selectedAsset.price, amount);

    if (res.success) {
      setStatus("success");
      setMessage(res.message);
      setUsdAmount("");
      router.refresh(); // Refresh Next.js Server Components to reflect new balances
    } else {
      setStatus("error");
      setMessage(res.message || "Trade failed.");
    }
  };

  return (
    <div className="bg-darkmode p-6 rounded-2xl border border-border shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">Quick Trade (Buy)</h3>
      <form onSubmit={handleBuy} className="flex flex-col gap-4">
        
        <div>
          <label className="text-sm text-white/50 mb-2 block">Select Asset</label>
          <select 
            className="w-full bg-body-bg border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-primary cursor-pointer"
            value={selectedAsset.id}
            onChange={(e) => setSelectedAsset(AVAILABLE_ASSETS.find(a => a.id === e.target.value)!)}
          >
            {AVAILABLE_ASSETS.map(asset => (
              <option key={asset.id} value={asset.id}>{asset.name} (${asset.price.toLocaleString()})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-white/50 mb-2 block">Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
            <input 
              type="number" 
              step="0.01"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-body-bg border border-border rounded-xl pl-8 pr-4 py-3 text-white outline-none focus:border-primary"
            />
          </div>
          <p className="text-xs text-white/30 mt-2 text-right">Max usable: ${maxUsd.toLocaleString()}</p>
        </div>

        {status === "error" && <p className="text-red-500 text-sm">{message}</p>}
        {status === "success" && <p className="text-green-400 text-sm">{message}</p>}

        <button 
          type="submit" 
          disabled={status === "loading" || parseFloat(usdAmount) > maxUsd}
          className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 mt-4 rounded-xl transition disabled:opacity-50"
        >
          {status === "loading" ? "Processing Block..." : `Buy ${selectedAsset.symbol.toUpperCase()}`}
        </button>
      </form>
    </div>
  );
}
