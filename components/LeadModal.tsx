"use client";

import { useEffect, useRef, useState } from "react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => nameRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Por favor ingresá tu nombre.");
      return;
    }
    if (!whatsapp.trim()) {
      setError("Por favor ingresá tu WhatsApp.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), whatsapp: whatsapp.trim() }),
      });

      if (!res.ok) throw new Error("Error al enviar");

      const { redirectUrl } = await res.json();
      window.location.href = redirectUrl;
    } catch {
      setError("Hubo un error. Intentá de nuevo.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111111] border border-[#FF4D1C]/30 shadow-[0_0_60px_rgba(255,77,28,0.2)]">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-[#FF4D1C]" />

        <div className="p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#999999] hover:text-white transition-colors text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>

          {/* Header */}
          <p className="text-[#FF4D1C] text-xs font-bold uppercase tracking-[0.3em] font-[family-name:var(--font-inter)] mb-3">
            Grupo exclusivo
          </p>
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-4xl text-white tracking-wide mb-2">
            Asegurá tu lugar en el grupo
          </h2>
          <p className="text-[#999999] text-sm font-[family-name:var(--font-inter)] mb-8 leading-relaxed">
            Completá el formulario y recibí el link del grupo en tu WhatsApp.
            El día <span className="text-[#FF4D1C]">DD/MM</span> recibís la
            oferta antes que nadie.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#FF4D1C] text-xs font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">
                ¿Cómo preferís que te llamen?
              </label>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="bg-[#1A1A1A] border border-white/10 text-white placeholder-[#555555] px-4 py-3 focus:outline-none focus:border-[#FF4D1C] transition-colors font-[family-name:var(--font-inter)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#FF4D1C] text-xs font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-inter)]">
                Tu WhatsApp con código de área
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+598 99 000 000"
                className="bg-[#1A1A1A] border border-white/10 text-white placeholder-[#555555] px-4 py-3 focus:outline-none focus:border-[#FF4D1C] transition-colors font-[family-name:var(--font-inter)]"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-[family-name:var(--font-inter)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#FF4D1C] text-white font-bold uppercase tracking-wider px-8 py-4 text-base hover:bg-[#e63d0f] active:bg-[#cc3500] transition-all duration-200 shadow-[0_0_30px_rgba(255,77,28,0.35)] hover:shadow-[0_0_40px_rgba(255,77,28,0.55)] disabled:opacity-60 disabled:cursor-not-allowed font-[family-name:var(--font-inter)] cursor-pointer"
            >
              {loading ? "Enviando..." : "Quiero unirme al grupo →"}
            </button>

            <p className="text-center text-[#555555] text-xs font-[family-name:var(--font-inter)]">
              Tu información es confidencial. Sin spam.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
