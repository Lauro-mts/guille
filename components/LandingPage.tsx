"use client";

import { useEffect, useState } from "react";
import LeadModal from "./LeadModal";

// ── Editar antes de publicar ──────────────────────────────────────────────────
const SALARY_PLACEHOLDER = "$X";
const DATE_PLACEHOLDER = "DD/MM";
const URGENCY_FILLED = 17;
const URGENCY_TOTAL = 30;
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
    // h-screen + pt-11 compensa a barra fixa de countdown no topo (44px)
    <section className="relative h-screen pt-11 flex flex-col justify-center items-center text-center px-6 bg-[#0D0D0D] overflow-hidden">
      {/* Glow de fundo */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#FF4D1C]/8 rounded-full blur-[140px] pointer-events-none" />

      <Watermark n="01" />

      {/* Label */}
      <div className="relative z-10 flex flex-col items-center">
        <Label>Curso de Bartender — Guille Cardozo | Punta del Este</Label>

        {/* Headline — escala por altura do viewport (vh) para garantir fit */}
        <h1 className="mt-3 font-[family-name:var(--font-bebas-neue)] text-[clamp(2.4rem,9vh,9rem)] leading-[0.88] tracking-wide max-w-5xl">
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

        {/* Divisor laranja */}
        <div className="mt-[clamp(0.75rem,2vh,2.5rem)] flex items-center gap-4 w-full max-w-sm">
          <div className="flex-1 h-px bg-[#FF4D1C]/50" />
          <span className="text-[#FF4D1C] text-[10px] font-bold tracking-[0.35em] font-[family-name:var(--font-inter)] uppercase">
            Grupo exclusivo
          </span>
          <div className="flex-1 h-px bg-[#FF4D1C]/50" />
        </div>

        {/* Subtítulo */}
        <p className="mt-[clamp(0.75rem,2vh,1.75rem)] text-[#999999] text-[clamp(0.85rem,1.8vh,1.1rem)] max-w-lg font-[family-name:var(--font-inter)] leading-relaxed">
          Únete al grupo. El día{" "}
          <span className="text-white font-semibold">
            <PH>{DATE_PLACEHOLDER}</PH>
          </span>{" "}
          recibís la oferta antes que nadie — con condiciones exclusivas para
          quienes llegaron primero.
        </p>

        <div className="mt-[clamp(1rem,2.5vh,2.5rem)]">
          <CTAButton onClick={onCTA}>Quiero unirme al grupo →</CTAButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#333333]">
        <span className="text-[9px] font-[family-name:var(--font-inter)] uppercase tracking-[0.4em]">
          Scroll
        </span>
        <div className="w-px h-7 bg-gradient-to-b from-[#444444] to-transparent animate-pulse" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0D0D] to-transparent pointer-events-none" />
    </section>
  );
}

// ── Barra de urgência ─────────────────────────────────────────────────────────

function UrgencyBar({ onCTA }: { onCTA: () => void }) {
  const pct = Math.round((URGENCY_FILLED / URGENCY_TOTAL) * 100);

  return (
    <section className="bg-[#111111] border-y border-[#FF4D1C]/15 px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="flex-1 w-full">
          <div className="flex items-baseline justify-between mb-2.5">
            <p className="font-[family-name:var(--font-bebas-neue)] text-white tracking-wide text-xl">
              <span className="text-[#FF4D1C]">{URGENCY_FILLED}</span> de{" "}
              {URGENCY_TOTAL} vagas no grupo preenchidas
            </p>
            <span className="text-[#FF4D1C] font-bold font-[family-name:var(--font-inter)] text-sm">
              {pct}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#222222]">
            <div
              className="h-full bg-[#FF4D1C] shadow-[0_0_10px_rgba(255,77,28,0.7)] transition-all duration-1000"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-[#555555] text-xs font-[family-name:var(--font-inter)] uppercase tracking-wider">
            {URGENCY_TOTAL - URGENCY_FILLED} lugares restantes
          </p>
        </div>
        <button
          onClick={onCTA}
          className="whitespace-nowrap border border-[#FF4D1C] text-[#FF4D1C] font-bold uppercase tracking-wider px-7 py-3 text-sm hover:bg-[#FF4D1C] hover:text-white transition-all duration-200 font-[family-name:var(--font-inter)] cursor-pointer"
        >
          Asegurar mi lugar →
        </button>
      </div>
    </section>
  );
}

// ── Seção 2 — Dor e Oportunidade ──────────────────────────────────────────────

function PainSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative bg-[#0D0D0D] px-6 py-24 overflow-hidden">
      <Watermark n="02" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <ChapterBar n="02" />
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
            &ldquo;¿Será que esto es para mí? ¿Vale la pena invertir mi tiempo
            y dinero en esto?&rdquo;
          </blockquote>

          <p>
            Esa duda tiene sentido. Ya viste promesas que no se cumplieron. Ya
            intentaste aprender solo. Ya pensaste en hacer un curso pero algo
            siempre lo impidió — el dinero, el tiempo, el miedo a que no valga
            la pena.
          </p>
        </div>

        {/* Virada */}
        <div className="mt-20">
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
        </div>

        {/* Ponte */}
        <div className="mt-14 border-l-4 border-[#FF4D1C] bg-[#111111] p-8">
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

        <div className="mt-12 flex justify-center">
          <CTAButton onClick={onCTA}>
            Quiero aprender de la manera correcta →
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

// ── Seção 3 — Quem é Guille ───────────────────────────────────────────────────

function AboutSection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative bg-[#111111] px-6 py-24 overflow-hidden">
      <Watermark n="03" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ChapterBar n="03" />
        <Label>El instructor</Label>
        <h2 className="mt-2 font-[family-name:var(--font-bebas-neue)] text-[#666666] text-3xl tracking-wide">
          ¿Quién te va a enseñar esto?
        </h2>

        <div className="mt-12 grid md:grid-cols-2 gap-12 items-start">
          {/* Fotos placeholders */}
          <div className="flex flex-col gap-4">
            <PhotoPlaceholder
              label="Foto principal — Guille Cardozo"
              className="aspect-[4/5]"
            />
            <div className="grid grid-cols-2 gap-4">
              <PhotoPlaceholder
                label="Foto ambientada — bar / coqueteleira"
                className="aspect-square"
              />
              <PhotoPlaceholder
                label="Foto exterior — Miami / cruceiro"
                className="aspect-square"
              />
            </div>
          </div>

          {/* Conteúdo */}
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

// ── Seção 4 — O que vai aprender ──────────────────────────────────────────────

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
      <Watermark n="04" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ChapterBar n="04" />
        <Label>El programa</Label>

        <h2 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-[clamp(3rem,8vw,7rem)] leading-none tracking-wide">
          Qué incluye
          <br />
          <span className="text-[#FF4D1C]">el curso</span>
        </h2>

        {/* Vídeo placeholder */}
        <VideoPlaceholder
          label="Vídeo de presentación del programa — reemplazar con embed de YouTube / Vimeo"
          className="mt-10 aspect-video"
        />

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

// ── Seção 5 — Para quem é ─────────────────────────────────────────────────────

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
      <Watermark n="05" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ChapterBar n="05" />
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

// ── Seção 6 — Depoimentos ─────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Nombre Apellido",
    city: "Montevideo",
    quote:
      "Texto do depoimento — uma frase curta e direta sobre o que o curso mudou. Substituir por depoimento real.",
  },
  {
    name: "Nombre Apellido",
    city: "Punta del Este",
    quote:
      "Segundo depoimento — concreto, com resultado específico mencionado. Substituir por depoimento real.",
  },
  {
    name: "Nombre Apellido",
    city: "Buenos Aires",
    quote:
      "Terceiro depoimento — idealmente de alguém que conseguiu trabalho no exterior. Substituir por depoimento real.",
  },
];

function TestimonialsSection() {
  return (
    <section className="relative bg-[#0D0D0D] px-6 py-24 overflow-hidden">
      <Watermark n="06" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ChapterBar n="06" />
        <Label>Lo que dicen</Label>

        <h2 className="mt-4 font-[family-name:var(--font-bebas-neue)] text-[clamp(2.5rem,6vw,5rem)] leading-tight tracking-wide">
          Resultados{" "}
          <span className="text-[#FF4D1C]">reales.</span>
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-[#111111] border border-white/5 p-6 flex flex-col gap-5 hover:border-[#FF4D1C]/20 transition-colors"
            >
              {/* Cabeçalho do card */}
              <div className="flex items-center gap-4">
                <PhotoPlaceholder
                  label={`Foto — ${t.name}`}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                />
                <div>
                  <p className="text-white font-bold font-[family-name:var(--font-inter)] text-sm">
                    {t.name}
                  </p>
                  <p className="text-[#FF4D1C] text-xs font-[family-name:var(--font-inter)] uppercase tracking-wider">
                    {t.city}
                  </p>
                </div>
              </div>

              {/* Aspas decorativas */}
              <span className="font-[family-name:var(--font-bebas-neue)] text-5xl text-[#FF4D1C]/20 leading-none -mb-3">
                &ldquo;
              </span>

              <p className="text-[#999999] font-[family-name:var(--font-inter)] italic leading-relaxed text-sm flex-1">
                {t.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Seção 7 — CTA Final ───────────────────────────────────────────────────────

function FinalCTASection({ onCTA }: { onCTA: () => void }) {
  return (
    <section className="relative bg-[#0D0D0D] px-6 py-24 overflow-hidden">
      <Watermark n="07" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#FF4D1C]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <ChapterBar n="07" />
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
      <HeroSection onCTA={open} />
      <UrgencyBar onCTA={open} />
      <PainSection onCTA={open} />
      <AboutSection onCTA={open} />
      <CurriculumSection onCTA={open} />
      <ForWhoSection onCTA={open} />
      <TestimonialsSection />
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
