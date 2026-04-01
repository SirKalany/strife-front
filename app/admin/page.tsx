"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import { setToken } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    console.log("Attempting login with:", username, password);
    try {
      const token = await adminApi.login(username, password);
      console.log("Token received:", token);
      setToken(token);
      router.push("/admin/dashboard");
    } catch (e) {
      console.log("Login error:", e);
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div
        className="w-full max-w-sm border border-border bg-surface p-8 space-y-6"
        style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)" }}
      >
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="text-xs text-accent font-mono tracking-widest mb-2">
            [ RESTRICTED ACCESS ]
          </div>
          <h1 className="text-2xl font-bold text-accent uppercase tracking-[0.2em]">
            Admin Panel
          </h1>
          <div className="w-16 h-0.5 bg-accent mx-auto mt-2" />
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-widest text-foreground/50">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition rounded-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono uppercase tracking-widest text-foreground/50">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-background border border-border text-foreground px-3 py-2 text-sm font-mono focus:outline-none focus:border-accent transition rounded-sm"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs font-mono text-center">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-2 bg-accent text-background font-bold uppercase tracking-widest text-sm font-mono hover:bg-accent-hover transition disabled:opacity-50"
          style={{ clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0% 100%)" }}
        >
          {loading ? "Authenticating..." : "Access"}
        </button>
      </div>
    </main>
  );
}
