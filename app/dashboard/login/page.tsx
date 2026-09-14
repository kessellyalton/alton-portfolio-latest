"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-lg font-bold text-navy-950">
            AK
          </div>
          <h1 className="mb-2 text-2xl font-bold text-ink-100">
            Dashboard Login
          </h1>
          <p className="text-sm text-ink-400">
            Enter your password to access the private dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur sm:p-8"
        >
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-400"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-navy-700 bg-navy-950/60 px-4 py-2.5 text-sm text-ink-100 placeholder-ink-500 outline-none transition-colors focus:border-gold-400/60"
            placeholder="Enter password"
          />

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-500">
          This is a private admin area. Not intended for public access.
        </p>
      </div>
    </div>
  );
}
