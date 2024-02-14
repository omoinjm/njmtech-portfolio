import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from 'react';
import { Contact, Hero, Projects, Skills } from '../components';
import { ISkills, ITabProjects } from '../db/models';

const Home: NextPage = () => {
  const [skills, setSkillData] = useState<ISkills[]>([]);
  const [projects, setProjectData] = useState<ITabProjects[]>([]);

  useEffect(() => {
    fetch('/api/skills')
      .then(response => response.json())
      .then(json => {
        setSkillData(json);
      })

    fetch('/api/projects')
      .then(response => response.json())
      .then(json => {
        setProjectData(json);
      })
  }, []);

  return (
    <>
      <Head>
        <title>Nhlanhla Junior Malaza</title>
        <meta
          name="google-site-verification"
          content="uhCz2o1FOPTi4BlD_3yZ1Nw_ER4VAybFWURc5vBaIVo"
        />
        <link rel="canonical" href="https://njmtech.vercel.app/" />
        <meta name="description" content="Nhlanhla Junior Malaza" />
        <meta name="description" content="Nhlanhla Junior Malaza website" />
        <meta name="description" content="Nhlanhla Junior Malaza website portfolio" />
        <meta
          name="description"
          content="Portfolio website of Nhlanhla Junior Malaza"
        />
        <meta property="og:site_name" content="Nhlanhla Junior Malaza" />
        <meta property="og:title" content="Nhlanhla Junior Malaza" />
        <meta property="og:title" content="Nhlanhla Junior Malaza website" />
        <meta name="description" content="Nhlanhla Junior Malaza website portfolio" />
        <meta
          property="og:title"
          content="Portfolio website of Nhlanhla Junior Malaza"
        />
        <meta property="og:url" content="https://njmtech.vercel.app/" />
        <meta itemProp="name" content="Nhlanhla Junior Malaza" />
        <meta itemProp="url" content="https://njm.vercel.app/" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064193/public/favicon_zqeo1n.ico" />
      </Head>
      <Hero />
      <Skills data={skills} />
      <Projects data={projects} />
      <Contact />
    </>
  );
};

export default Home;
