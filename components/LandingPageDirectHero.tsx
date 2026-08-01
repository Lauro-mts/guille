"use client";

import { HeroOnlyContent } from "./LandingPage";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/Ep3XCCK6oj40Gbq5AxPgiL";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function LandingPageDirectHero() {
  const handleCTA = () => {
    window.fbq?.("track", "Lead");
    window.location.href = WHATSAPP_GROUP_URL;
  };

  return <HeroOnlyContent onCTA={handleCTA} />;
}
