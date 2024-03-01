import type { NextPage } from "next";
import Head from "next/head";
import { Contact } from "../components";

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contact</title>
        <meta
          name="google-site-verification"
          content="uhCz2o1FOPTi4BlD_3yZ1Nw_ER4VAybFWURc5vBaIVo"
        />
        <link rel="canonical" href="https://njmtech.vercel.app/contact" />
        <meta property="og:site_name" content="Nhlanhla Junior Malaza" />
        <meta property="og:title" content="Contact" />
        <meta
          name="description"
          content="Nhlanhla Junior Malaza contact page"
        />
        <meta property="og:url" content="https://njmtech.vercel.app/contact" />
        <meta itemProp="name" content="Contact" />
        <meta itemProp="url" content="https://njm.vercel.app/contact" />
        <meta property="og:type" content="website" />

        <link
          rel="icon"
          href="https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064193/public/favicon_zqeo1n.ico"
        />
      </Head>
      <Contact />
    </>
  );
};

export default Index;
