"use client";

import React, { useState, useEffect } from "react";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { MenuModel, FooterModel, LinkModel } from "@/types";
import DataService from "@/services/data.service";

interface LayoutProps {
  children: React.ReactNode;
}
const links = async (): Promise<LinkModel[]> => {
  const result: any = await DataService.get_call("menu", null);

  console.log(result);

  return result?.page_links || [];
};
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [nLinks, setNLinks] = useState<MenuModel[]>([]);
  const [fLinks, setFLinks] = useState<FooterModel[]>([]);

  useEffect(() => {
    links(); //.then(setNavLinks);
  }, []);

  // console.log(navLinks);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar data={[]} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
