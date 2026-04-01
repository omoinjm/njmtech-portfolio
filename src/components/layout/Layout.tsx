"use client";

import React, { useState, useEffect } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { MenuModel, FooterModel, LinkModel } from "@/types";
import DataService from "@/services/data.service";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [nLinks, setNLinks] = useState<MenuModel[]>([]);
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
          setNLinks(response.nav_menu || []);
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
      {/* Pass the actual state to your components */}
      <Navbar data={nLinks} />

      <main className="flex-grow">
        {loading ? <div>Loading...</div> : children}
      </main>

      <Footer data={fLinks} />
    </div>
  );
};

export default Layout;
