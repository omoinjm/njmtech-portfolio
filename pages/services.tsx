import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface IArea {
   width: number | null | undefined;
   height: number | null | undefined;
}

// Hook
function useWindowSize() {
   // Initialize state with undefined width/height so server and client renders match
   // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
   const [windowSize, setWindowSize] = useState<IArea>({
      width: undefined,
      height: undefined,
   });

   useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== "undefined") {
         // Handler to call on window resize
         const handleResize = (): void => {
            // Set window width/height to state
            setWindowSize({
               width: window.innerWidth,
               height: window.innerHeight,
            });
         }

         // Add event listener
         window.addEventListener("resize", handleResize);

         // Call handler right away so state gets updated with initial window size
         handleResize();

         // Remove event listener on cleanup
         return () => window.removeEventListener("resize", handleResize);
      }
   }, []); // Empty array ensures that effect is only run on mount
   return windowSize;
}

const Error = styled.div<{ height?: number | null | undefined }>`
  background-color: rgba(72, 49, 212, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  padding: 0 2em;
  color: #fff;
  height: calc(${(props) => props.height}px / 1.46);
`;

const Services = () => {
   const size = useWindowSize();

   return (
      <>
         <Head>
            <title>Services</title>
            <meta
               name="google-site-verification"
               content="uhCz2o1FOPTi4BlD_3yZ1Nw_ER4VAybFWURc5vBaIVo"
            />
            <link rel="canonical" href="https://njmtech.vercel.app/services" />
            <meta property="og:site_name" content="Nhlanhla Junior Malaza" />
            <meta property="og:title" content="Services" />
            <meta
               name="description"
               content="Nhlanhla Junior Malaza services page"
            />
            <meta property="og:url" content="https://njmtech.vercel.app/services" />
            <meta itemProp="name" content="Services" />
            <meta itemProp="url" content="https://njm.vercel.app/services" />
            <meta property="og:type" content="website" />
            <link
               rel="icon"
               href="https://res.cloudinary.com/dfta3fn6p/image/upload/v1676064193/public/favicon_zqeo1n.ico"
            />
         </Head>
         <Error height={size.height} className="jumbotron">
            <h1 className="display-4">Coming soon...</h1>
            <Link href="/">Go back to site</Link>
         </Error>
      </>
   );
};

export default Services;
