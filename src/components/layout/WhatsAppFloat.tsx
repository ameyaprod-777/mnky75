"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";

const whatsappUrl = `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

export function WhatsAppFloat() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Réserver via WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold-500/30 bg-[#25D366] text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-110 hover:border-gold-500/50 hover:shadow-xl active:scale-95"
      >
        <MessageCircle className="h-7 w-7" />
      </Link>
    </motion.div>
  );
}
