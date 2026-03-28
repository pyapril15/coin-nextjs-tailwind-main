"use client";

import { useState } from "react";

export default function SecurityClient({ 
  mfaEnabled, 
  activityLogs 
}: { 
  mfaEnabled: boolean, 
  activityLogs: any[] 
}) {
  const [mfa, setMfa] = useState(mfaEnabled);
  const [loading, setLoading] = useState(false);

  const toggleMfa = async () => {
    setLoading(true);
    // In production, this would call a server action passing a TOTP App verification payload.
    // For this simulation, we mock the response delay.
    setTimeout(() => {
      setMfa(!mfa);
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="bg-darkmode p-8 rounded-2xl border border-border shadow-xl mt-8">
      <h2 className="text-xl font-bold text-white mb-6">Security Center</h2>
      
      <div className="flex items-center justify-between border border-border p-6 rounded-xl bg-body-bg mb-8">
        <div>
          <h3 className="text-white font-bold text-lg">Multi-Factor Authentication (MFA)</h3>
          <p className="text-white/50 text-sm">Secure your account using an authenticator app (TOTP).</p>
        </div>
        <button 
          onClick={toggleMfa}
          disabled={loading}
          className={`px-6 py-2 font-bold rounded-xl transition ${mfa ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-primary hover:bg-secondary text-white'} disabled:opacity-50`}
        >
          {loading ? "Processing..." : mfa ? "Enabled (Click to Disable)" : "Enable 2FA"}
        </button>
      </div>

      <h3 className="text-white font-medium mb-4">Recent Access Logs</h3>
      {activityLogs.length === 0 ? (
        <p className="text-white/50 text-sm italic">Tracking initializing... IPs not yet recorded.</p>
      ) : (
        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-body-bg text-white/50">
              <tr>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">IP Address</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Device Agent</th>
                <th className="px-4 py-3 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium">{log.action}</td>
                  <td className="px-4 py-3 text-red-300 font-mono text-xs">{log.ipAddress || "Unknown Origin"}</td>
                  <td className="px-4 py-3 text-white/50 truncate max-w-xs hidden md:table-cell">{log.userAgent || "Unknown Device"}</td>
                  <td className="px-4 py-3 text-white/50">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
