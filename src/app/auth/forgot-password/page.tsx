"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/app/actions/authActions";
import Link from "next/link";
import Logo from "@/components/layout/header/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    const res = await requestPasswordReset(email);
    
    if (res.success) {
      setStatus("success");
      setMessage(res.message);
    } else {
      setStatus("error");
      setMessage(res.message || "Something went wrong.");
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center p-4 pt-32">
      <div className="bg-banner-image absolute w-full h-full top-0 blur-390 pointer-events-none -z-10"></div>
      <div className="w-full max-w-md bg-darkmode p-8 rounded-2xl border border-border shadow-2xl text-center relative z-10">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-white/60 mb-8">Enter your registered email address and we'll send you a secure link to reset your password.</p>

        {status === "success" ? (
          <div className="p-4 bg-primary/20 text-primary border border-primary/50 rounded-xl mb-6">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-darkmode border border-border px-5 py-4 rounded-xl text-white outline-none focus:border-primary transition"
              required
              disabled={status === "loading"}
            />
            {status === "error" && <p className="text-red-500 text-sm">{message}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition disabled:opacity-50"
            >
              {status === "loading" ? "Processing..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-8 text-white/50">
          Remembered your password? <Link href="/" className="text-primary hover:underline">Sign In</Link>
        </div>
      </div>
    </section>
  );
}
