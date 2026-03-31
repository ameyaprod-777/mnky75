"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Status {
  is_open: boolean;
  message: string | null;
  blockedCreneaux?: string[];
}

export function StatusIndicator({
  className,
  onStatusChange,
}: {
  className?: string;
  onStatusChange?: (status: Status) => void;
}) {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/status")
      .then((res) => res.json())
      .then((data: Status) => {
        if (!cancelled) {
          setStatus(data);
          onStatusChange?.(data);
        }
      })
      .catch(() => {
        if (!cancelled) setStatus({ is_open: true, message: null });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [onStatusChange]);

  if (loading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl border border-jungle-800/50 bg-jungle-sage/30 px-4 py-3 text-sm text-jungle-400",
          className
        )}
      >
        <span className="h-4 w-4 animate-pulse rounded-full bg-gold-500/50" />
        Vérification des disponibilités…
      </div>
    );
  }

  const isOpen = status?.is_open ?? true;
  const message = status?.message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium",
        isOpen
          ? "border-jungle-700/50 bg-jungle-sage/40 text-jungle-200"
          : "border-gold-500/40 bg-gold-500/10 text-gold-400/95",
        className
      )}
    >
      {isOpen ? (
        <>
          <CheckCircle className="h-5 w-5 shrink-0 text-jungle-400" />
          <span>Table disponible</span>
        </>
      ) : (
        <>
          <XCircle className="h-5 w-5 shrink-0" />
          <span>{message || "Complet ce soir"}</span>
        </>
      )}
    </motion.div>
  );
}
