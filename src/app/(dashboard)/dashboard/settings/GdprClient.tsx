"use client";

import { useState } from "react";
import { exportUserData, deleteAccountPermanently } from "@/app/actions/gdprActions";
import { signOut } from "next-auth/react";

export default function GdprClient() {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleExport = async () => {
    setDownloading(true);
    const res = await exportUserData();
    if (res.success && res.payload) {
      const blob = new Blob([res.payload], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `enterprise_crypto_gdpr_export_${new Date().getTime()}.json`;
      link.click();
    }
    setDownloading(false);
  };

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setDeleting(true);
    const res = await deleteAccountPermanently();
    if (res.success) {
      // Force logout and redirect since account no longer exists globally
      signOut({ callbackUrl: '/' });
    }
    setDeleting(false);
  };

  return (
    <div className="bg-darkmode p-8 rounded-2xl border border-red-900/50 shadow-xl mt-8">
      <h2 className="text-xl font-bold text-white mb-6">GDPR & Data Privacy</h2>
      
      <div className="flex flex-col gap-6 border-b border-border pb-6 mb-6">
        <div>
          <h3 className="text-white font-medium mb-1">Download Your Data</h3>
          <p className="text-white/50 text-sm mb-4">Export a complete JSON payload containing your financial ledgers, active sessions, and identity vectors.</p>
          <button 
            onClick={handleExport}
            disabled={downloading}
            className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition rounded-xl"
          >
            {downloading ? "Compiling..." : "Export Data Archive"}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-red-400 font-medium mb-1">Danger Zone: Terminate Account</h3>
        <p className="text-white/50 text-sm mb-4">Permanently erase your identity, wipe your USD wallet, and forfeit all digital assets. This cannot be undone.</p>
        
        {confirm ? (
          <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl">
             <p className="text-red-400 text-sm mb-4">Are you absolutely sure? All financial data will be vaporized from the ledger permanently.</p>
             <div className="flex gap-4">
               <button onClick={handleDelete} disabled={deleting} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition disabled:opacity-50">
                 {deleting ? "Vaporizing..." : "Yes, Erase Everything"}
               </button>
               <button onClick={() => setConfirm(false)} className="px-6 py-2 border border-border text-white hover:bg-white/5 rounded-xl transition">Cancel</button>
             </div>
          </div>
        ) : (
          <button onClick={handleDelete} className="px-6 py-2 bg-red-900/40 text-red-500 hover:bg-red-600 hover:text-white border border-red-900 transition rounded-xl">
            Delete Account Data
          </button>
        )}
      </div>
    </div>
  );
}
