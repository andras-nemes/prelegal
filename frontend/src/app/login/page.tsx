"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function LoginPage() {
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    router.push("/nda");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-10 w-full max-w-sm">
        <h1
          className="text-3xl font-bold mb-1"
          style={{ color: "#032147" }}
        >
          PreLegal
        </h1>
        <p className="text-sm mb-8" style={{ color: "#888888" }}>
          Draft legal agreements in minutes
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#032147" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "#209dd7" } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" style={{ color: "#032147" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "#209dd7" } as React.CSSProperties}
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#753991" }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
