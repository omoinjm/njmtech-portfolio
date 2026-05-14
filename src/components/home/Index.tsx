"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Hero } from "./Hero";
import { Newsletter } from "./Newsletter";
import { Services } from "./Services";
import { Skills } from "./Skills";
import type { KeyboardSkill } from "./skills-keyboard-data";

const SkillsKeyboardScene = dynamic(
  () => import("./SkillsKeyboardScene").then((module) => module.SkillsKeyboardScene),
  {
    ssr: false,
  },
);

export default function HomePage() {
  const [activeSkill, setActiveSkill] = useState<KeyboardSkill | null>(null);
  const handleActiveSkillChange = useCallback((skill: KeyboardSkill | null) => {
    setActiveSkill(skill);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--accent)/0.2),_transparent_34%),radial-gradient(circle_at_20%_30%,_hsl(var(--primary)/0.12),_transparent_22%),radial-gradient(circle_at_80%_18%,_rgba(255,255,255,0.08),_transparent_16%),linear-gradient(180deg,_rgba(2,8,18,0.08),_rgba(2,8,18,0.3))]" />
        <div className="starfield-layer starfield-layer-sm" />
        <div className="starfield-layer starfield-layer-md" />
        <div className="starfield-layer starfield-layer-lg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_48%,_rgba(2,6,16,0.42)_100%)]" />
      </div>
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <SkillsKeyboardScene onActiveSkillChange={handleActiveSkillChange} />
      </div>
      <main className="relative z-10">
        <Hero />
        <Skills activeSkill={activeSkill} />
        <Services />
        <Newsletter />
      </main>
    </div>
  );
}
