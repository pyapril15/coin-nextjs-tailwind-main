"use client";

import { useState } from "react";
import { updateProfileName } from "@/app/actions/settingsActions";

export default function SettingsClient({ currentName, currentEmail }: { currentName: string, currentEmail: string }) {
  const [name, setName] = useState(currentName);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    const res = await updateProfileName(name);
    
    if (res.success) {
      setStatus("success");
      setMessage(res.message);
    } else {
      setStatus("error");
      setMessage(res.message);
    }
    
    setTimeout(() => {
      setStatus("idle");
    }, 5000);
  };

  return (
    <div className="grid grid-cols-1 max-w-2xl gap-8">
      
      <div className="bg-darkmode p-8 rounded-2xl border border-border shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
        
        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
          <div>
            <label className="text-sm text-white/50 mb-2 block">Enterprise Account Email (Read-Only)</label>
            <input 
              type="text" 
              value={currentEmail}
              disabled
              className="w-full bg-body-bg border border-border rounded-xl px-4 py-3 text-white/50 outline-none opacity-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-white/50 mb-2 block">Profile Avatar (Local Only)</label>
            <input 
              type="file"
              accept="image/*"
              className="w-full bg-body-bg border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition"
            />
            <p className="text-xs mt-2 text-white/30">Select a new avatar to securely encode into your profile. Note: Only Base64 simulation supported without AWS S3 keys.</p>
          </div>

          <div>
            <label className="text-sm text-white/50 mb-2 block">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-body-bg border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-primary transition"
              required
            />
          </div>

          {status === "error" && <p className="text-red-500 text-sm">{message}</p>}
          {status === "success" && <p className="text-green-400 text-sm">{message}</p>}

          <button 
            type="submit" 
            disabled={status === "loading" || name === currentName}
            className="self-start px-8 bg-primary hover:bg-secondary text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {status === "loading" ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>

    </div>
  );
}
