"use client";

import React from "react";
import { Footer } from "./Footer";
import { FloatingAssistant } from "./FloatingAssistant";
import { Navbar } from "./Navbar";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { SEOGuideDialog } from "./SEOGuideDialog";
import { MechanicalKeyboardGuideDialog } from "./MechanicalKeyboardGuideDialog";
import { MouseGlow } from "./MouseGlow";
import { FooterModel, LinkModel } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  menuLinks: LinkModel;
}

const Layout: React.FC<LayoutProps> = ({ children, menuLinks }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="print:hidden">
        <Navbar navMenu={menuLinks.nav_menu ?? []} />
      </div>

      <main className="flex-grow">{children}</main>

      <div className="print:hidden">
        <Footer data={menuLinks.nav_footer ?? []} />
        <FloatingAssistant />
        <KeyboardShortcuts />
        <SEOGuideDialog />
        <MechanicalKeyboardGuideDialog />
        <MouseGlow />
      </div>
    </div>
  );
};

export default Layout;
