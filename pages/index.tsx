import type { NextPage } from "next";
import Head from "next/head";
import { Contact, Hero, Projects, Skills } from '../components';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Nhlanhla Malaza</title>
        <meta
          name="google-site-verification"
          content="uhCz2o1FOPTi4BlD_3yZ1Nw_ER4VAybFWURc5vBaIVo"
        />
        <link rel="canonical" href="https://njmportfolio.netlify.app/" />
        <meta name="description" content="Nhlanhla Malaza" />
        <meta name="description" content="Nhlanhla Malaza website" />
        <meta
          name="description"
          content="Portfolio website of Nhlanhla Malaza"
        />
        <meta property="og:site_name" content="Nhlanhla Malaza" />
        <meta property="og:title" content="Nhlanhla Malaza" />
        <meta property="og:title" content="Nhlanhla Malaza website" />
        <meta
          property="og:title"
          content="Portfolio website of Nhlanhla Malaza"
        />
        <meta property="og:url" content="https://njmportfolio.netlify.app/" />
        <meta itemProp="name" content="Nhlanhla Malaza" />
        <meta itemProp="url" content="https://njmportfolio.netlify.app/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
};

export default Home;
