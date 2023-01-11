
import { Analytics } from '@vercel/analytics/react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from "next/app";
import { useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import Layout from "../components/layout";
import { ILinks } from '../interfaces';
import "../styles/globals.css";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  * {
    box-sizing: border-box;
  }
`;

export default function MyApp({ Component, pageProps }: AppProps) {
  const [data, setData] = useState<ILinks>({});

  useEffect(() => {
    fetch('/api/links')
      .then(response => response.json())
      .then(json => {
        setData(json);
      })
  }, []);

  return (
    <>
      <GlobalStyle />
      <Layout data={data}>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </>
  );
}
