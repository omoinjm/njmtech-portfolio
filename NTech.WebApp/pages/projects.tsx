import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Projects } from "../components";
import { ITabProjects } from "../framework/models";

const Home: NextPage = () => {
  const [projects, setProjectData] = useState<ITabProjects[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((json) => {
        setProjectData(json);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Projects</title>
        <meta
          name="google-site-verification"
          content="uhCz2o1FOPTi4BlD_3yZ1Nw_ER4VAybFWURc5vBaIVo"
        />
        <link rel="canonical" href="https://njmtech.vercel.app/projects" />
        <meta property="og:site_name" content="Nhlanhla Junior Malaza" />
        <meta property="og:title" content="Projects" />
        <meta
          name="description"
          content="Nhlanhla Junior Malaza projects page"
        />
        <meta property="og:url" content="https://njmtech.vercel.app/projects" />
        <meta itemProp="name" content="Projects" />
        <meta itemProp="url" content="https://njm.vercel.app/projects" />
        <meta property="og:type" content="website" />
        <link
          rel="icon"
          href="https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064193/public/favicon_zqeo1n.ico"
        />
      </Head>
      <Projects data={projects} />
    </>
  );
};

export default Home;
