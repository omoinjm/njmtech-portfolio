"use client";

import React, { useState, useEffect } from "react";
import { Footer } from "./Footer";
import { FloatingAssistant } from "./FloatingAssistant";
import { Navbar } from "./Navbar";
import { MenuModel, FooterModel, LinkModel } from "@/types";
import DataService from "@/services/data.service";
import { PageLoader } from "@/components/ui/page-loader";
import { AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [nLinks, setNLinks] = useState<LinkModel>({});
  const [fLinks, setFLinks] = useState<FooterModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        // Explicitly typing the response from the service
        const response = (await DataService.get_call(
          "menu",
          null,
        )) as LinkModel;

        if (response) {
          setNLinks(response || {});
          setFLinks(response.nav_footer || []);
        }
      } catch (error) {
        console.error("Failed to fetch menu data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar data={nLinks} />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {loading ? <PageLoader key="loader" /> : children}
        </AnimatePresence>
      </main>

      <Footer data={fLinks} />
      <FloatingAssistant />
    </div>
  );
};

export default Layout;
