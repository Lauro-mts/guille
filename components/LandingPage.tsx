"use client";

import { useEffect, useRef, useState } from "react";
import LeadModal from "./LeadModal";

// ── Editar antes de publicar ──────────────────────────────────────────────────
const SALARY_PLACEHOLDER = "$500";
const DATE_PLACEHOLDER = "14/07";
// TODO: substituir pela data real de abertura da oferta (UTC-3 = Montevideo)
const PROMO_DATE = new Date("2026-07-15T20:00:00-03:00");

// ── Countdown ─────────────────────────────────────────────────────────────────

function calcTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

function useCountdown(target: Date) {
  // null no SSR para evitar hydration mismatch com Date.now()
  const [t, setT] = useState<ReturnType<typeof calcTimeLeft> | null>(null);
  useEffect(() => {
    setT(calcTimeLeft(target));
    const id = setInterval(() => setT(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

function CountUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-[3px]">
      <span className="font-[family-name:var(--font-bebas-neue)] text-2xl text-[#FF4D1C] leading-none tabular-nums">
        {value}
      </span>
      <span className="text-[#555555] text-[9px] uppercase tracking-wider font-[family-name:var(--font-inter)]">
        {label}
      </span>
    </div>
  );
}

function CountdownBar({ onCTA }: { onCTA: () => void }) {
  const t = useCountdown(PROMO_DATE);
  const pad = (n: number) => String(n).padStart(2, "0");
  const sep = (
    <span className="text-[#FF4D1C]/40 font-[family-name:var(--font-bebas-neue)] text-lg leading-none select-none">
      :
    </span>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-11 bg-[#0A0A0A] border-b border-[#FF4D1C]/20 flex items-center">
      <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between gap-4">

        {/* Label */}
        <span className="hidden sm:block text-[#555555] text-[10px] font-bold uppercase tracking-[0.3em] font-[family-name:var(--font-inter)] whitespace-nowrap">
          A oferta abre em
        </span>

        {/* Timer — null enquanto hidrata no client */}
        {!t ? (
          <div className="flex items-center gap-2 opacity-0 pointer-events-none" aria-hidden>
            <CountUnit value="00" label="días" />
            {sep}<CountUnit value="00" label="hs" />
            {sep}<CountUnit value="00" label="min" />
            {sep}<CountUnit value="00" label="seg" />
          </div>
        ) : t.expired ? (
          <span className="text-[#FF4D1C] text-sm font-bold uppercase tracking-wider font-[family-name:var(--font-inter)]">
            🔥 Oferta disponível agora
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <CountUnit value={pad(t.days)} label="días" />
            {sep}
            <CountUnit value={pad(t.hours)} label="hs" />
            {sep}
            <CountUnit value={pad(t.minutes)} label="min" />
            {sep}
            <CountUnit value={pad(t.seconds)} label="seg" />
          </div>
        )}

        {/* CTA sutil */}
        <button
          onClick={onCTA}
          className="hidden md:block text-[#FF4D1C] text-[10px] font-bold uppercase tracking-[0.25em] font-[family-name:var(--font-inter)] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
        >
          Unirme al grupo →
        </button>
      </div>
    </div>
  );
}

// ── Primitivos ────────────────────────────────────────────────────────────────

function CTAButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#FF4D1C] text-white font-bold uppercase tracking-wider px-10 py-5 text-base md:text-lg hover:bg-[#e63d0f] active:bg-[#cc3500] transition-all duration-200 shadow-[0_0_30px_rgba(255,77,28,0.35)] hover:shadow-[0_0_50px_rgba(255,77,28,0.6)] font-[family-name:var(--font-inter)] cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[#FF4D1C] text-xs font-bold uppercase tracking-[0.3em] font-[family-name:var(--font-inter)]">
      {children}
    </span>
  );
}

// Placeholders que precisam ser substituídos antes de publicar
function PH({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[#FF4D1C] border-b-2 border-dashed border-[#FF4D1C]/60">
      {children}
    </span>
  );
}

function PhotoPlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#1A1A1A] border border-dashed border-white/15 flex flex-col items-center justify-center gap-3 text-[#444444] overflow-hidden ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
      <span className="text-[10px] font-[family-name:var(--font-inter)] uppercase tracking-[0.2em] text-center px-3 leading-relaxed">
        {label}
      </span>
    </div>
  );
}

function VideoPlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#1A1A1A] border border-dashed border-[#FF4D1C]/20 flex flex-col items-center justify-center gap-4 text-[#444444] ${className}`}
    >
      <div className="w-16 h-16 border border-[#FF4D1C]/30 flex items-center justify-center">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF4D1C"
          strokeWidth="1.5"
          opacity="0.5"
        >
          <polygon points="5 3 19 12 5 21 5 3" fill="#FF4D1C" />
        </svg>
      </div>
      <span className="text-xs font-[family-name:var(--font-inter)] uppercase tracking-[0.2em] text-center px-6">
        {label}
      </span>
    </div>
  );
}

// Número gigante de fundo — estilo fight night poster
function Watermark({ n }: { n: string }) {
  return (
    <span className="absolute right-[-1rem] top-[-2rem] font-[family-name:var(--font-bebas-neue)] text-[22rem] leading-none text-[#FF4D1C]/[0.045] select-none pointer-events-none z-0">
      {n}
    </span>
  );
}

// Barra de capítulo com número
function ChapterBar({ n }: { n: string }) {
  return (
    <div className="flex items-center gap-5 mb-10">
      <span className="font-[family-name:var(--font-bebas-neue)] text-[#FF4D1C]/60 text-xs tracking-[0.4em]">
        [ {n} ]
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-[#FF4D1C]/25 to-transparent" />
    </div>
  );
}

// ── Header fixo ───────────────────────────────────────────────────────────────

function StickyHeader({ onCTA }: { onCTA: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-11 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      } bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#FF4D1C]/20`}
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <span className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-widest text-white whitespace-nowrap">
          Guille <span className="text-[#FF4D1C]">Cardozo</span>
        </span>
        <button
          onClick={onCTA}
          className="bg-[#FF4D1C] text-white font-bold uppercase tracking-wider px-6 py-2.5 text-sm hover:bg-[#e63d0f] transition-all duration-200 font-[family-name:var(--font-inter)] cursor-pointer shadow-[0_0_20px_rgba(255,77,28,0.3)] whitespace-nowrap"
        >
          Quiero unirme →
        </button>
      </div>
    </header>
  );
}

// ── Seção 1 — Hero ────────────────────────────────────────────────────────────

function HeroSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative min-h-[100svh] md:pt-11 flex flex-col md:justify-center items-center bg-[#0D0D0D]">

      {/* Camada de imagem — overflow-hidden aqui para não cortar conteúdo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mobile: 9:16, expert no topo */}
        <div
          className="absolute inset-0 md:hidden bg-cover"
          style={{ backgroundImage: "url('/heromobile.png.png')", backgroundPosition: "center top" }}
        />
        {/* Desktop: 16:9, expert à direita */}
        <div
          className="absolute inset-0 hidden md:block bg-cover"
          style={{ backgroundImage: "url('/herodesktop.png')", backgroundPosition: "center center" }}
        />
      </div>

      {/* Overlays mobile */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]/10 pointer-events-none" />
      <div
        className="absolute inset-0 md:hidden pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(13,13,13,0.5) 0%, transparent 28%, transparent 72%, rgba(13,13,13,0.5) 100%)" }}
      />

      {/* Overlay desktop — gradiente da esquerda */}
      <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent pointer-events-none" />

      <Watermark n="01" />

      {/* Conteúdo */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center md:items-start text-center md:text-left pt-[32svh] min-[380px]:pt-[38svh] md:pt-0 pb-8 md:pb-0">

        <Label>Curso de Bartender — Guille Cardozo | Punta del Este</Label>

        <h1 className="mt-3 font-[family-name:var(--font-bebas-neue)] text-[clamp(42px,13vw,64px)] md:text-[clamp(2.4rem,9vh,9rem)] leading-[0.9] md:leading-[0.88] tracking-wide max-w-5xl">
          <span
            className="block text-transparent"
            style={{ WebkitTextStroke: "clamp(1px, 0.15vh, 2px) #FF4D1C" }}
          >
            {SALARY_PLACEHOLDER} por fin
          </span>
          <span className="block text-white">de semana.</span>
          <span className="block text-[#FF4D1C]">Viajes por el mundo.</span>
          <span className="block text-white">Una vida de historias.</span>
        </h1>

        {/* Divisor */}
        <div className="mt-4 md:mt-[clamp(0.75rem,2vh,2.5rem)] flex items-center gap-4 w-full max-w-sm">
          <div className="flex-1 h-px bg-[#FF4D1C]/50" />
          <span className="text-[#FF4D1C] text-[10px] font-bold tracking-[0.35em] font-[family-name:var(--font-inter)] uppercase">
            Grupo exclusivo
          </span>
          <div className="flex-1 h-px bg-[#FF4D1C]/50" />
        </div>

        {/* Subtítulo */}
        <p className="mt-3 md:mt-[clamp(0.75rem,2vh,1.75rem)] text-[#999999] text-[clamp(0.85rem,3.5vw,1rem)] md:text-[clamp(0.85rem,1.8vh,1.1rem)] max-w-lg font-[family-name:var(--font-inter)] leading-relaxed">
          Únete al grupo. El día{" "}
          <span className="text-white font-semibold">
            <PH>{DATE_PLACEHOLDER}</PH>
          </span>{" "}
          recibís la oferta antes que nadie — con condiciones exclusivas para
          quienes llegaron primero.
        </p>

        {/* CTA — full-width no mobile */}
        <div className="mt-5 md:mt-[clamp(1rem,2.5vh,2.5rem)] w-full max-w-[448px] md:w-auto">
          <CTAButton onClick={onCTA} className="w-full md:w-auto">
            Quiero unirme al grupo →
          </CTAButton>
        </div>
      </div>

      {/* Scroll indicator — só desktop */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 text-[#333333]">
        <span className="text-[9px] font-[family-name:var(--font-inter)] uppercase tracking-[0.4em]">
          Scroll
        </span>
        <div className="w-px h-7 bg-gradient-to-b from-[#444444] to-transparent animate-pulse" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent pointer-events-none" />
    </section>
  );
}

// ── Seção 3 — Dor e Oportunidade ──────────────────────────────────────────────

function PainSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative bg-[#0D0D0D] px-6 py-24 overflow-hidden">
      <Watermark n="03" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Grid: texto esquerda / imagem direita no desktop */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:items-center">

          {/* Coluna de texto */}
          <div>
            <ChapterBar n="03" />
            <Label>El problema</Label>

            <h2 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-[clamp(2.5rem,6vw,5rem)] leading-tight text-white tracking-wide">
              Trabajás en eventos. A fin de mes la cuenta sigue apretada.
            </h2>

            <div className="mt-10 space-y-5 text-[#999999] text-lg font-[family-name:var(--font-inter)] leading-relaxed">
              <p>
                Mientras tanto, hay gente usando el bar como pasaje al mundo —
                trabajando en cruceros, en resorts, en otros países — y vos te
                preguntás:
              </p>

              <blockquote className="text-white text-xl md:text-2xl font-semibold border-l-4 border-[#FF4D1C] pl-6 py-2">
                &ldquo;¿Será que esto es para mí? ¿Vale la pena invertir mi
                tiempo y dinero en esto?&rdquo;
              </blockquote>

              <p>
                Esa duda tiene sentido. Ya viste promesas que no se cumplieron.
                Ya intentaste aprender solo. Ya pensaste en hacer un curso pero
                algo siempre lo impidió — el dinero, el tiempo, el miedo a que
                no valga la pena.
              </p>
            </div>
          </div>

          {/* Coluna de imagem */}
          <div className="mt-12 lg:mt-0">
            {/* Desktop */}
            <div className="relative hidden overflow-hidden border border-white/10 bg-black lg:block">
              <img
                src="/secao2desktop.png"
                alt="Jovem pensativo em um bar, representando dúvida e estagnação profissional"
                loading="lazy"
                className="h-[460px] w-full object-cover object-center"
                style={{ filter: "brightness(0.88) saturate(0.85)" }}
              />
              <div className="pointer-events-none absolute inset-0 bg-black/20" />
            </div>

            {/* Mobile — abaixo de todo o texto */}
            <div className="relative overflow-hidden border border-white/10 bg-black lg:hidden">
              <img
                src="/secao2mobile.png"
                alt="Jovem pensativo em um bar, representando dúvida e estagnação profissional"
                loading="lazy"
                className="h-[360px] w-full object-cover object-center"
                style={{ filter: "brightness(0.88) saturate(0.85)" }}
              />
              <div className="pointer-events-none absolute inset-0 bg-black/20" />
            </div>
          </div>
        </div>

        {/* Virada — oportunidade com grid editorial */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">

          {/* Texto */}
          <div>
            <Label>La oportunidad real</Label>

            <h3 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-[clamp(2rem,5vw,4rem)] leading-tight tracking-wide">
              <span className="text-[#FF4D1C]">Bartender profesional</span>
              <br />
              <span className="text-white">no es un trabajo cualquiera.</span>
              <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #FFFFFF" }}
              >
                Es una profesión global.
              </span>
            </h3>

            <p className="mt-6 text-[#999999] text-lg font-[family-name:var(--font-inter)] leading-relaxed">
              No importa el país, no importa el idioma — quien sabe trabajar
              detrás de una barra tiene lugar garantizado. En Punta del Este en
              temporada. En Miami. En cruceros. En cualquier lugar.
            </p>

            <p className="mt-4 text-[#999999] text-lg font-[family-name:var(--font-inter)] leading-relaxed">
              La diferencia entre quien se queda y quien se va no es talento.{" "}
              <span className="text-white font-semibold">
                Es haber aprendido de la manera correcta
              </span>{" "}
              — con método, con postura, y con alguien que ya vivió todo esto en
              carne propia.
            </p>

            {/* Ponte — fica junto ao texto no desktop */}
            <div className="mt-10 border-l-4 border-[#FF4D1C] bg-[#111111] p-8">
              <p className="text-white text-lg font-[family-name:var(--font-inter)] leading-relaxed">
                Guille salió de Montevideo con una coctelera y llegó a Miami.
              </p>
              <p className="mt-2 text-white text-xl font-bold font-[family-name:var(--font-inter)]">
                No por suerte. Por método.
              </p>
              <p className="mt-4 text-[#999999] font-[family-name:var(--font-inter)]">
                Y ahora está abriendo ese camino para quienes viven acá en Punta
                del Este y quieren lo mismo.
              </p>
              <p className="mt-4 text-[#FF4D1C] italic font-[family-name:var(--font-inter)]">
                &ldquo;Una profesión que podés usar donde y cuando necesites — y
                que ninguna crisis te puede quitar.&rdquo;
              </p>
            </div>
          </div>

          {/* Mosaico de imagens */}
          <div className="grid grid-cols-2 gap-3">

            {/* Miami — imagem principal, largura total */}
            <div className="relative col-span-2 overflow-hidden border border-white/10 bg-black">
              <img
                src="/opportunity-miami.webp"
                alt="Guille trabalhando como bartender em Miami"
                loading="lazy"
                className="h-[320px] w-full object-cover object-top saturate-[0.8] contrast-[1.08]"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/25" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#FF4D1C] font-[family-name:var(--font-inter)]">
                  Miami
                </p>
                <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80 font-[family-name:var(--font-inter)]">
                  Bar Service
                </p>
              </div>
            </div>

            {/* Cruzeiro França */}
            <div className="relative overflow-hidden border border-white/10 bg-black">
              <img
                src="/opportunity-cruise-france.webp"
                alt="Guille em cruzeiro na França"
                loading="lazy"
                className="h-[210px] w-full object-cover object-top saturate-[0.75] contrast-[1.08]"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/35" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#FF4D1C] font-[family-name:var(--font-inter)]">
                  Crucero
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/75 font-[family-name:var(--font-inter)]">
                  France 2008
                </p>
              </div>
            </div>

            {/* Equipe profissional */}
            <div className="relative overflow-hidden border border-white/10 bg-black">
              <img
                src="/opportunity-elite-team.webp"
                alt="Guille em ambiente profissional com equipe de bar"
                loading="lazy"
                className="h-[210px] w-full object-cover object-top saturate-[0.75] contrast-[1.08]"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/35" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#FF4D1C] font-[family-name:var(--font-inter)]">
                  Trayectoria
                </p>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/75 font-[family-name:var(--font-inter)]">
                  Equipo profesional
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <CTAButton onClick={onCTA}>
            Quiero aprender de la manera correcta →
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

// ── Seção 4 — Quem é Guille ───────────────────────────────────────────────────

// Card de imagem reutilizável com overlay + label
function InstructorPhoto({
  src,
  alt,
  label,
  sublabel,
  className = "",
  imgClassName = "",
}: {
  src: string;
  alt: string;
  label: string;
  sublabel?: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden border border-white/10 bg-black ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full object-cover object-top saturate-[0.85] contrast-[1.08] ${imgClassName}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/25" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#FF4D1C] font-[family-name:var(--font-inter)]">
          {label}
        </p>
        {sublabel && (
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70 font-[family-name:var(--font-inter)]">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

function AboutSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative bg-[#111111] px-6 py-24 overflow-hidden">
      <Watermark n="04" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <ChapterBar n="04" />
        <Label>El instructor</Label>
        <h2 className="mt-2 font-[family-name:var(--font-bebas-neue)] text-[#666666] text-3xl tracking-wide">
          ¿Quién te va a enseñar esto?
        </h2>

        {/* Imagem principal — mobile only, aparece entre intro e bio */}
        <div className="mt-8 lg:hidden">
          <InstructorPhoto
            src="/images/instructor-main.webp"
            alt="Guille Cardozo — retrato de autoridade, braços cruzados"
            label="Guille Cardozo"
            sublabel="Instructor"
            imgClassName="h-[340px]"
          />
        </div>

        {/* Grid: mosaico esquerda / bio direita */}
        <div className="mt-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14">

          {/* Coluna de imagens — desktop: estica para igualar altura da bio */}
          <div className="hidden lg:flex lg:self-stretch flex-col gap-3">
            <InstructorPhoto
              src="/images/instructor-main.webp"
              alt="Guille Cardozo — retrato de autoridade, braços cruzados"
              label="Guille Cardozo"
              sublabel="Instructor"
              className="flex-1 min-h-[300px]"
              imgClassName="h-full"
            />
            <div className="grid grid-cols-2 gap-3">
              <InstructorPhoto
                src="/images/instructor-bar.webp"
                alt="Guille trabalhando em bar profissional com garrafas ao fundo"
                label="Bar / Coctelería"
                imgClassName="h-[190px]"
              />
              <InstructorPhoto
                src="/images/instructor-miami-selfie.webp"
                alt="Guille em rooftop de Miami com coqueteleira"
                label="Miami"
                sublabel="Trayectoria real"
                imgClassName="h-[190px]"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="font-[family-name:var(--font-bebas-neue)] text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-wide">
              <span className="text-white">Guille</span>
              <br />
              <span className="text-[#FF4D1C]">Cardozo</span>
            </h3>

            <p className="mt-6 text-[#999999] text-lg font-[family-name:var(--font-inter)] leading-relaxed">
              Salió de Montevideo con una coctelera y llegó a Miami.
            </p>
            <p className="mt-3 text-[#999999] text-lg font-[family-name:var(--font-inter)] leading-relaxed">
              En el camino: hotel 5 estrellas, crucero por el Mediterráneo, y
              una visa de trabajo en EE.UU. conseguida a puro esfuerzo.
            </p>
            <p className="mt-3 text-[#999999] text-lg font-[family-name:var(--font-inter)] leading-relaxed">
              No por suerte. Porque aprendió de la manera correcta — y supo
              posicionarse en cualquier mercado, en cualquier país.
            </p>
            <p className="mt-3 text-[#999999] text-lg font-[family-name:var(--font-inter)] leading-relaxed">
              Hoy está en Punta del Este, y por primera vez está abriendo ese
              camino para quien quiere lo mismo.
            </p>

            <p className="mt-6 text-[#FF4D1C] italic text-lg font-[family-name:var(--font-inter)]">
              &ldquo;No es solo hacer tragos. Es una forma de ser que va con
              este trabajo.&rdquo;
            </p>

            {/* Credenciais */}
            <ul className="mt-8 space-y-3 border-t border-white/5 pt-8">
              {[
                "Hotel 5 estrellas",
                "Crucero por el Mediterráneo",
                "Miami, EE.UU.",
                "20+ años de experiencia",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-white font-[family-name:var(--font-inter)] text-lg"
                >
                  <span className="text-[#FF4D1C] font-bold text-sm">→</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Duas imagens menores — mobile only, abaixo da bio */}
            <div className="mt-8 grid grid-cols-2 gap-3 lg:hidden">
              <InstructorPhoto
                src="/images/instructor-bar.webp"
                alt="Guille trabalhando em bar profissional com garrafas ao fundo"
                label="Bar / Coctelería"
                imgClassName="h-[160px]"
              />
              <InstructorPhoto
                src="/images/instructor-miami-selfie.webp"
                alt="Guille em rooftop de Miami com coqueteleira"
                label="Miami"
                sublabel="Trayectoria real"
                imgClassName="h-[160px]"
              />
            </div>

            <div className="mt-10">
              <CTAButton onClick={onCTA}>
                Quiero aprender con Guille →
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Seção 5 — O que vai aprender ──────────────────────────────────────────────

function CurriculumSection({ onCTA }: { onCTA: () => void }) {
  const pillars = [
    {
      n: "01",
      title: "Técnica de tragos y cócteles",
      desc: "Desde lo básico hasta el nivel profesional — los clásicos que todo bartender necesita dominar.",
    },
    {
      n: "02",
      title: "Postura y atención profesional",
      desc: "Cómo comportarse detrás de una barra — lo que separa al buen bartender del memorable.",
    },
    {
      n: "03",
      title: "Cómo conseguir tu primer trabajo",
      desc: "CV, entrevista, dónde buscar — el camino real para entrar al mercado.",
    },
    {
      n: "04",
      title: "Cómo trabajar en el exterior",
      desc: "Cruceros, resorts internacionales, bares fuera de Uruguay — Guille ya pasó por todo eso.",
    },
  ];

  return (
    <section className="relative bg-[#0D0D0D] px-6 py-24 overflow-hidden">
      <Watermark n="05" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ChapterBar n="05" />
        <Label>El programa</Label>

        <h2 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-[clamp(3rem,8vw,7rem)] leading-none tracking-wide">
          Qué incluye
          <br />
          <span className="text-[#FF4D1C]">el curso</span>
        </h2>


        {/* Pilares */}
        <div className="mt-16 grid md:grid-cols-2 gap-px bg-white/5">
          {pillars.map((p) => (
            <div
              key={p.n}
              className="bg-[#0D0D0D] p-8 hover:bg-[#0f0f0f] transition-colors group"
            >
              <span className="font-[family-name:var(--font-bebas-neue)] text-5xl text-[#FF4D1C]/25 group-hover:text-[#FF4D1C]/50 tracking-wide transition-colors">
                {p.n}
              </span>
              <h3 className="mt-2 font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-wide">
                {p.title}
              </h3>
              <p className="mt-2 text-[#999999] font-[family-name:var(--font-inter)] leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Formato + Bônus */}
        <div className="mt-14 grid md:grid-cols-2 gap-8">
          <div className="border border-white/8 p-8">
            <Label>Formato</Label>
            <ul className="mt-6 space-y-4">
              {[
                "Clases presenciales en Punta del Este con Guille",
                "Módulos grabados online para ver cuando y donde quieras",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-white font-[family-name:var(--font-inter)]"
                >
                  <span className="text-[#FF4D1C] font-bold mt-0.5 text-sm">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[#FF4D1C]/25 bg-[#FF4D1C]/5 p-8">
            <Label>Bonos exclusivos</Label>
            <p className="mt-4 text-white text-lg font-[family-name:var(--font-inter)] leading-relaxed">
              Revelados solo para quienes entren al grupo.
            </p>
            <p className="mt-2 text-[#999999] font-[family-name:var(--font-inter)]">
              Lo vas a querer ver antes que nadie.
            </p>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <CTAButton onClick={onCTA}>Quiero asegurar mi lugar →</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ── Seção 7 — Para quem é ─────────────────────────────────────────────────────

function ForWhoSection({ onCTA }: { onCTA: () => void }) {
  const yesItems = [
    "Trabajás o querés trabajar en eventos y gastronomía",
    "Querés ganar más en la temporada de Punta del Este",
    "Soñás con trabajar fuera de Uruguay algún día",
    "Sos comunicativo, responsable y querés ser tomado en serio",
    "Estás dispuesto a aprender de la manera correcta, con método",
  ];
  const noItems = [
    "Creés que ser bartender es sobre tomar alcohol",
    "Querés un atajo sin esfuerzo",
    "No estás comprometido con la profesión",
  ];

  return (
    <section className="relative bg-[#111111] px-6 py-24 overflow-hidden">
      <Watermark n="07" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ChapterBar n="07" />
        <Label>Para quién es</Label>

        <h2 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-[clamp(2.5rem,6vw,5rem)] leading-tight tracking-wide">
          Este curso no es para todos —{" "}
          <span className="text-[#FF4D1C]">y eso es intencional.</span>
        </h2>

        <p className="mt-4 text-[#999999] text-lg font-[family-name:var(--font-inter)]">
          Es para quien está dispuesto a tomar la profesión en serio y usar el
          bar como herramienta de libertad real.
        </p>

        <div className="mt-14 grid md:grid-cols-2 gap-8">
          <div className="border border-green-900/40 bg-green-950/10 p-8">
            <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-white tracking-wide mb-6">
              Es para vos si...
            </h3>
            <ul className="space-y-4">
              {yesItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[#999999] font-[family-name:var(--font-inter)]"
                >
                  <span className="text-green-400 font-bold text-lg mt-0.5 flex-shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-white/5 p-8">
            <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl text-[#555555] tracking-wide mb-6">
              No es para vos si...
            </h3>
            <ul className="space-y-4">
              {noItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[#555555] font-[family-name:var(--font-inter)]"
                >
                  <span className="text-red-900 font-bold text-lg mt-0.5 flex-shrink-0">
                    ✗
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-white text-xl font-[family-name:var(--font-inter)] font-semibold">
            Si te identificaste con el primer lado —{" "}
            <span className="text-[#FF4D1C]">tu lugar está en el grupo.</span>
          </p>
          <p className="mt-2 text-[#999999] font-[family-name:var(--font-inter)]">
            Entrá ahora y el día <PH>{DATE_PLACEHOLDER}</PH> recibís la oferta
            completa antes que nadie.
          </p>
          <div className="mt-8">
            <CTAButton onClick={onCTA}>Este curso es para mí →</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Seção 2 — Depoimentos em vídeo ───────────────────────────────────────────

const VIDEO_TESTIMONIALS = [
  {
    ytId: "HDNd8j3sdiY",
    name: "",
    city: "",
    role: "",
    quote: "",
  },
  {
    ytId: "uYz4Q7RreJ8",
    name: "",
    city: "",
    role: "",
    quote: "",
  },
  {
    ytId: "wus3yCmY4Bk",
    name: "",
    city: "",
    role: "",
    quote: "",
  },
];

function VideoTestimonial({
  ytId,
  name,
  city,
  role,
  quote,
}: (typeof VIDEO_TESTIMONIALS)[0]) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col bg-[#100E0C] border border-white/5 hover:border-[#FF4D1C]/25 transition-colors duration-300">
      {/* Área de vídeo */}
      <div
        className="relative aspect-[9/16] overflow-hidden cursor-pointer group"
        onClick={() => !playing && setPlaying(true)}
      >
        {!playing ? (
          <>
            {/* Thumbnail do YouTube — hqdefault é o formato disponível para Shorts */}
            <img
              src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
              alt={`Depoimento de ${name}`}
              className="w-full h-full object-cover saturate-[0.65] contrast-[1.08] group-hover:scale-[1.03] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[60px] h-[60px] bg-[#FF4D1C] flex items-center justify-center shadow-[0_0_40px_rgba(255,77,28,0.45)] group-hover:scale-110 group-hover:shadow-[0_0_60px_rgba(255,77,28,0.7)] transition-all duration-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              </div>
            </div>

            {/* Label inferior */}
            {role && (
              <div className="absolute bottom-3 left-3 pointer-events-none">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF4D1C] font-[family-name:var(--font-inter)]">
                  {role}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* controls=0 remove toda a UI do YouTube — título, canal, barra, logo */}
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&controls=0&modestbranding=1&iv_load_policy=3&loop=1&playlist=${ytId}`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          </>
        )}
      </div>

      {/* Citação + identidade — só renderiza se tiver conteúdo */}
      {(quote || name) && (
        <div className="p-5 flex flex-col gap-3 flex-1">
          {quote && (
            <>
              <span className="font-[family-name:var(--font-bebas-neue)] text-4xl text-[#FF4D1C]/20 leading-none -mb-1 select-none">
                &ldquo;
              </span>
              <p className="text-[#888888] font-[family-name:var(--font-inter)] italic leading-relaxed text-sm flex-1">
                {quote}
              </p>
            </>
          )}
          {name && (
            <div className="border-t border-white/5 pt-4 mt-1">
              <p className="text-white font-bold font-[family-name:var(--font-inter)] text-sm">
                {name}
              </p>
              {city && (
                <p className="mt-0.5 text-[#FF4D1C] text-[10px] font-[family-name:var(--font-inter)] uppercase tracking-[0.22em]">
                  {city}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TestimonialsSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section
      className="relative px-6 py-24 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, #1C1208 0%, #0E0C0A 55%, #0B0B0B 100%)",
      }}
    >
      <Watermark n="02" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <ChapterBar n="02" />
        <Label>Lo que dicen</Label>

        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="font-[family-name:var(--font-bebas-neue)] text-[clamp(2.5rem,6vw,5rem)] leading-tight tracking-wide">
            Resultados <span className="text-[#FF4D1C]">reales.</span>
          </h2>
          <p className="text-[#444444] text-sm font-[family-name:var(--font-inter)] md:text-right max-w-xs">
            Personas reales. Sin edición.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {VIDEO_TESTIMONIALS.map((t) => (
            <VideoTestimonial key={t.ytId} {...t} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <CTAButton onClick={onCTA}>Quiero unirme al grupo →</CTAButton>
        </div>
      </div>
    </section>
  );
}

// ── Seção 6 — Provas sociais do Google ───────────────────────────────────────

const GOOGLE_RATING = {
  business: "Taller de Coctelería – Punta del Este",
  score: "5,0",
  reviews: 47,
};

const FEATURED_GOOGLE_REVIEWS = [
  { src: "/images/imagesgoogle/google-review-simon-cedres.png", name: "Simón Cedrés" },
  { src: "/images/imagesgoogle/google-review-mariana-amaral.png", name: "Mariana Amaral" },
  { src: "/images/imagesgoogle/google-review-mili.png", name: "Mili" },
  { src: "/images/imagesgoogle/google-review-paula-kim.png", name: "Paula Kim" },
  { src: "/images/imagesgoogle/google-review-maizza-piriz.png", name: "Maizza Piriz" },
];

const MORE_GOOGLE_REVIEWS = [
  { src: "/images/imagesgoogle/google-review-kiara-cotto.png", name: "Kiara Cotto" },
  { src: "/images/imagesgoogle/google-review-marcos-rodriguez.png", name: "Marcos Rodríguez" },
  { src: "/images/imagesgoogle/google-review-claudia-larrea.png", name: "Claudia Larrea" },
  { src: "/images/imagesgoogle/google-review-estefani-rodriguez.png", name: "Estefani Rodríguez" },
  { src: "/images/imagesgoogle/google-review-leo-gomez.png", name: "Leo Gómez" },
  { src: "/images/imagesgoogle/google-review-nicole-ferreira.png", name: "Nicole Ferreira" },
  { src: "/images/imagesgoogle/google-review-arturo-dos-santos.png", name: "Arturo Dos Santos" },
  { src: "/images/imagesgoogle/google-review-gregory-diaz.png", name: "Gregory Díaz" },
];

function GoogleLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.7-6.1 8.1-11.3 8.1-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.1-5.1C33.7 6.5 29.1 4.7 24 4.7 13.4 4.7 4.8 13.3 4.8 23.9s8.6 19.2 19.2 19.2c9.6 0 18.4-7 18.4-19.2 0-1.2-.1-2.3-.4-3.4z"
      />
      <path
        fill="#FF3D00"
        d="m6.6 14.7 6 4.4C14.3 15.4 18.8 12.7 24 12.7c3.1 0 5.8 1.1 8 3l5.1-5.1C33.7 6.5 29.1 4.7 24 4.7c-7.4 0-13.9 4.2-17.4 10z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.1c5 0 9.6-1.9 13-5.2l-6-4.9c-1.9 1.4-4.3 2.2-7 2.2-5.2 0-9.6-3.4-11.2-8.1l-6 4.6c3.4 6.8 10.4 11.4 17.2 11.4z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6 4.9c-.4.4 6.4-4.7 6.4-14.3 0-1.2-.1-2.3-.4-3.3z"
      />
    </svg>
  );
}

function GoogleRatingBadge() {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-6">
      <div className="inline-flex items-center gap-4 bg-[#100E0C] border border-white/10 px-6 py-4">
        <GoogleLogo />
        <div>
          <p className="text-white text-sm font-bold font-[family-name:var(--font-inter)] leading-tight">
            {GOOGLE_RATING.business}
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-[family-name:var(--font-bebas-neue)] text-3xl text-white leading-none">
              {GOOGLE_RATING.score}
            </span>
            <span className="text-[#FBBC05] text-base leading-none tracking-tight">
              ★★★★★
            </span>
          </div>
          <p className="mt-1 text-[#999999] text-xs font-[family-name:var(--font-inter)] uppercase tracking-[0.2em]">
            {GOOGLE_RATING.reviews} avaliações no Google
          </p>
        </div>
      </div>

      <img
        src="/images/imagesgoogle/google-rating-overview-reference.png"
        alt={`${GOOGLE_RATING.business} — perfil no Google`}
        className="w-[220px] sm:w-[240px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
}

function GoogleReviewCard({ src, name }: { src: string; name: string }) {
  return (
    <div className="break-inside-avoid mb-5 bg-white overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <img
        src={src}
        alt={`Avaliação de ${name} no Google`}
        className="w-full h-auto block"
      />
    </div>
  );
}

function GoogleReviewsCarousel({ items }: { items: typeof MORE_GOOGLE_REVIEWS }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((r) => (
          <div
            key={r.src}
            className="snap-start shrink-0 w-[240px] sm:w-[280px] bg-white overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          >
            <img
              src={r.src}
              alt={`Avaliação de ${r.name} no Google`}
              className="w-full h-auto block"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => scrollByCards(-1)}
          aria-label="Anterior"
          className="w-10 h-10 flex items-center justify-center border border-white/15 text-white hover:border-[#FF4D1C] hover:text-[#FF4D1C] transition-colors cursor-pointer"
        >
          ‹
        </button>
        <button
          onClick={() => scrollByCards(1)}
          aria-label="Siguiente"
          className="w-10 h-10 flex items-center justify-center border border-white/15 text-white hover:border-[#FF4D1C] hover:text-[#FF4D1C] transition-colors cursor-pointer"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function GoogleReviewsSection() {
  return (
    <section className="relative bg-[#0D0D0D] px-6 py-24 overflow-hidden">
      <Watermark n="06" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <ChapterBar n="06" />
        <Label>Prueba social</Label>

        <h2 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-[clamp(2.5rem,6vw,5rem)] leading-tight tracking-wide">
          Lo dice <span className="text-[#FF4D1C]">Google.</span>
        </h2>

        <div className="mt-8">
          <GoogleRatingBadge />
        </div>

        <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-5">
          {FEATURED_GOOGLE_REVIEWS.map((r) => (
            <GoogleReviewCard key={r.src} {...r} />
          ))}
        </div>

        <div className="mt-16">
          <p className="text-[#444444] text-sm font-[family-name:var(--font-inter)] uppercase tracking-[0.2em] mb-6">
            Más opiniones
          </p>
          <GoogleReviewsCarousel items={MORE_GOOGLE_REVIEWS} />
        </div>
      </div>
    </section>
  );
}

// ── Seção 8 — CTA Final ───────────────────────────────────────────────────────

function FinalCTASection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative bg-[#0D0D0D] px-6 py-24 overflow-hidden">
      <Watermark n="08" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#FF4D1C]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <ChapterBar n="08" />
        <Label>Últimos lugares</Label>

        <h2 className="mt-6 font-[family-name:var(--font-bebas-neue)] text-[clamp(3.5rem,9vw,8rem)] leading-none tracking-wide">
          <span className="text-white">Los lugares</span>
          <br />
          <span className="text-[#FF4D1C]">son limitados.</span>
        </h2>

        <p className="mt-8 text-[#999999] text-lg font-[family-name:var(--font-inter)] leading-relaxed">
          Quien entre al grupo ahora recibe la oferta completa el día{" "}
          <span className="text-white font-semibold">
            <PH>{DATE_PLACEHOLDER}</PH>
          </span>{" "}
          — con precio, bonos y condiciones exclusivas que no van a estar
          disponibles para nadie más.
        </p>

        <p className="mt-3 text-white font-bold font-[family-name:var(--font-inter)] text-lg">
          Completá el formulario y asegurá tu lugar.
        </p>

        {/* Passos */}
        <div className="mt-12 text-left space-y-5">
          {[
            "Completás el formulario y recibís el link del grupo en tu WhatsApp.",
            "Dentro del grupo, Guille comparte contenido exclusivo en los próximos días.",
            `El día ${DATE_PLACEHOLDER} recibís la oferta completa — precio, bonos y condiciones que solo existen para quienes están en el grupo.`,
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="font-[family-name:var(--font-bebas-neue)] text-3xl text-[#FF4D1C] leading-none w-8 flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-[#999999] font-[family-name:var(--font-inter)] leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <CTAButton onClick={onCTA} className="w-full text-lg py-6">
            Quiero unirme al grupo y recibir la oferta →
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

// ── Página ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const open = () => setModalOpen(true);
  const close = () => setModalOpen(false);

  return (
    <main className="bg-[#0D0D0D] text-white">
      <CountdownBar onCTA={open} />
      <StickyHeader onCTA={open} />
      <HeroSection onCTA={open} />
      <TestimonialsSection onCTA={open} />
      <PainSection onCTA={open} />
      <AboutSection onCTA={open} />
      <CurriculumSection onCTA={open} />
      <GoogleReviewsSection />
      <ForWhoSection onCTA={open} />
      <FinalCTASection onCTA={open} />

      <footer className="bg-[#0D0D0D] border-t border-white/5 py-8 text-center">
        <p className="text-[#333333] text-sm font-[family-name:var(--font-inter)]">
          © {new Date().getFullYear()} Guille Cardozo — Curso de Bartender
          Profesional, Punta del Este.
        </p>
      </footer>

      <LeadModal isOpen={modalOpen} onClose={close} />
    </main>
  );
}
