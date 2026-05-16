"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? "Something went wrong. Please try again.");
        return;
      }
      login(data.token, data.email);
      router.push("/");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#f0f4f8" }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-1.5" style={{ color: "#032147" }}>
            PreLegal
          </h1>
          <p className="text-sm" style={{ color: "#888888" }}>
            Draft legal agreements in minutes
          </p>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "signin"
                ? "bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={mode === "signin" ? { color: "#032147" } : undefined}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === "signup"
                ? "bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={mode === "signup" ? { color: "#032147" } : undefined}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "#032147" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": "#209dd7" } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium" style={{ color: "#032147" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": "#209dd7" } as React.CSSProperties}
            />
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#753991" }}
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        {mode === "signin" && (
          <p className="mt-6 text-center text-xs" style={{ color: "#888888" }}>
            No account?{" "}
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="underline hover:opacity-70"
              style={{ color: "#209dd7" }}
            >
              Sign up for free
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
