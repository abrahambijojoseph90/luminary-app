"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#07090f" }}>
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#c49a3c22", border: "1px solid #c49a3c44" }}>
              <span style={{ color: "#c49a3c", fontSize: "1.2rem" }}>◈</span>
            </div>
            <span className="font-ui text-2xl font-bold tracking-wider" style={{ color: "#e8e4d9" }}>LUMINARY</span>
          </div>
          <p className="font-display text-lg italic" style={{ color: "#c49a3c" }}>Shape the Leader Within</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "#0d1021", border: "1px solid #1e2540" }}>
          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: "#07090f" }}>
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: mode === m ? "#c49a3c" : "transparent",
                  color: mode === m ? "#07090f" : "#6b7280",
                }}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{ background: "#111828", border: "1px solid #1e2540", color: "#e8e4d9" }}
                  onFocus={e => e.target.style.borderColor = "#c49a3c"}
                  onBlur={e => e.target.style.borderColor = "#1e2540"}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "#111828", border: "1px solid #1e2540", color: "#e8e4d9" }}
                onFocus={e => e.target.style.borderColor = "#c49a3c"}
                onBlur={e => e.target.style.borderColor = "#1e2540"}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder={mode === "register" ? "Min. 8 characters" : "••••••••"}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "#111828", border: "1px solid #1e2540", color: "#e8e4d9" }}
                onFocus={e => e.target.style.borderColor = "#c49a3c"}
                onBlur={e => e.target.style.borderColor = "#1e2540"}
              />
            </div>

            {error && (
              <p className="text-sm text-center py-2 px-4 rounded-lg" style={{ background: "#ff4d4d11", color: "#ff8080", border: "1px solid #ff4d4d22" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all mt-2"
              style={{ background: loading ? "#8a6d2a" : "#c49a3c", color: "#07090f", cursor: loading ? "wait" : "pointer" }}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#3a4060" }}>
          Luminary — Leadership Training Platform
        </p>
      </div>
    </div>
  );
}
