import React, { useState } from "react";
import { ILinks } from "../db/models";
import { Footer } from "./footer/footer";
import GoToTop from "./GoToTop";
import { NavBar } from "./navbar/navbar";
import { Sidebar } from "./sidebar/sidebar";
type LayoutProps = {
  children: React.ReactNode;
  data: ILinks;
};

const Layout = ({ children, data }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

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
