"use client";

import { useState, Suspense } from "react";
import { completePasswordReset } from "@/app/actions/authActions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/layout/header/logo";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing security token in URL.");
      return;
    }
    if (password !== confirm) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }
    
    setStatus("loading");
    const res = await completePasswordReset(token, password);
    
    if (res.success) {
      setStatus("success");
      setMessage(res.message);
    } else {
      setStatus("error");
      setMessage(res.message || "Failed to reset password.");
    }
  };

  return (
    <div className="w-full max-w-md bg-darkmode p-8 rounded-2xl border border-border shadow-2xl text-center">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Create New Password</h1>
      <p className="text-white/60 mb-8">Choose a strong, unique password to secure your account moving forward.</p>

      {status === "success" ? (
        <div className="flex flex-col gap-6">
          <div className="p-4 bg-green-500/20 text-green-400 border border-green-500/50 rounded-xl">
            {message}
          </div>
          <Link href="/" className="w-full text-center bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition">
            Proceed to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full bg-darkmode border border-border px-5 py-4 rounded-xl text-white outline-none focus:border-primary transition"
            required
            disabled={status === "loading"}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm Password"
            className="w-full bg-darkmode border border-border px-5 py-4 rounded-xl text-white outline-none focus:border-primary transition"
            required
            disabled={status === "loading"}
          />
          {status === "error" && <p className="text-red-500 text-sm text-left px-2">{message}</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition disabled:opacity-50 mt-2"
          >
            {status === "loading" ? "Securing Account..." : "Confirm Password Change"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center p-4 pt-32">
      <div className="bg-banner-image absolute w-full h-full top-0 blur-390 pointer-events-none -z-10"></div>
      <div className="relative z-10 w-full max-w-md">
        <Suspense fallback={<div className="text-white text-center">Loading secure connection...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </section>
  );
}
