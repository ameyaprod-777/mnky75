"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifiant, password }),
      });
      if (res.ok) {
        router.push(from);
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Accès refusé.");
    } catch {
      setError("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-jungle-800/50 bg-jungle-sage/40 p-8">
        <h1 className="font-display text-xl font-semibold text-jungle-cream">
          Connexion admin — {SITE.name}
        </h1>
        <p className="mt-1 text-sm text-jungle-400">
          Saisissez vos identifiants pour accéder à l’interface.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="identifiant" className="sr-only">
              Identifiant
            </label>
            <input
              id="identifiant"
              type="text"
              value={identifiant}
              onChange={(e) => setIdentifiant(e.target.value)}
              placeholder="Identifiant"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-jungle-700/50 bg-jungle-800/50 px-4 py-3 text-jungle-cream placeholder:text-jungle-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-jungle-700/50 bg-jungle-800/50 px-4 py-3 text-jungle-cream placeholder:text-jungle-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/30"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500/90 text-jungle-deep hover:bg-gold-400"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
