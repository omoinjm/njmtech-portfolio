import React, { useState } from 'react';
import { Footer } from './footer/footer';
import { NavBar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import GoToTop from "./GoToTop";

type LayoutProps = {
   children: React.ReactNode,
};

const Layout = ({ children }: LayoutProps) => {
   const [isOpen, setIsOpen] = useState(false);

   const toggle = () => {
      setIsOpen(!isOpen);
   };

   return (
      <main>
         <GoToTop />
         <Sidebar isOpen={isOpen} toggle={toggle} />
         <NavBar toggle={toggle} />
         {children}
         <Footer />
      </main>
   )
}

export default Layout