import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Curso de Bartender Profesional — Guille Cardozo | Punta del Este",
  description:
    "Aprendé bartending profesional con Guille Cardozo. Técnica, postura y el camino real para trabajar en cruceros, resorts y el exterior.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
