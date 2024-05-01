import React, { useEffect, useState } from "react";
import { LinkModel } from "../framework/models/link_model";
import { Footer } from "./footer/footer";
import GoToTop from "./GoToTop";
import { NavBar } from "./navbar/navbar";
import { Sidebar } from "./sidebar/sidebar";
import { BaseComponent } from "../framework/base/base.component";
import { unstable_cache } from "next/cache";

type LayoutProps = {
  children: React.ReactNode;
};

class LayoutComponent extends BaseComponent {
  Layout = ({ children }: LayoutProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => {
      setIsOpen(!isOpen);
    };

    const [data, setData] = useState<LinkModel | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        setData(await this.getLinks());
      };

      fetchData();

      // Since there are no dependencies, we don't need to return anything
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

  private getLinks = async (): Promise<LinkModel | null> => {
    this.response_model = await this.get_sync_call(
      "Navigation/GetNavigation",
      null,
    );

    console.log(this.response_model);

    return {
      page_links: this.response_model.model.menu_list,
      footer_links: this.response_model.model.footer_list,
    };
  };

  private getCachedLinks = unstable_cache(
    async () => {
      return this.getLinks();
    },
    ["app-links"],
    { tags: ["links-next-js"], revalidate: 3600 },
  );
}

export default new LayoutComponent().Layout;
