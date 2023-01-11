import React, { useState } from 'react';
import { ILinks } from '../interfaces';
import { Footer } from './footer/footer';
import GoToTop from "./GoToTop";
import { NavBar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
type LayoutProps = {
   children: React.ReactNode,
   data: ILinks
};

const Layout = ({ children, data }: LayoutProps) => {
   const [isOpen, setIsOpen] = useState(false);

   const toggle = () => {
      setIsOpen(!isOpen);
   };

   return (
      <main>
         <GoToTop />
         <Sidebar isOpen={isOpen} toggle={toggle} data={data?.pageLinks} />
         <NavBar toggle={toggle} data={data?.pageLinks} />
         {children}
         <Footer data={data?.footerLinks} />
      </main>
   )
}

export default Layout