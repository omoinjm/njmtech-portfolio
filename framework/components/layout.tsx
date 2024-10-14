import { LinkModel } from "@/models/link_model";
import DataService from "@/services/data.service";
import React, { useEffect, useState } from "react";
import { Footer } from "./footer/footer";
import GoToTop from "./GoToTop";
import { NavBar } from "./navbar/navbar";
import { Sidebar } from "./sidebar/sidebar";

type LayoutProps = {
  children: React.ReactNode
};

const fetchLinks = async (): Promise<LinkModel> => {
  const [menu, footer] = await Promise.all([
    DataService.get_call("menu", null),
    DataService.get_call("footer", null),
  ]);

  return {
    page_links: menu || [],
    footer_links: footer || [],
  };
};

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<LinkModel | null>(null);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      setData(await fetchLinks());
    };
    fetchData();
  }, []);

  return (
    <main>
      <GoToTop />
      <Sidebar isOpen={isOpen} toggle={toggle} data={data?.page_links} />
      <NavBar toggle={toggle} data={data?.page_links} />
      {children}
      <Footer data={data?.footer_links} />
    </main>
  );
};

export default Layout;


