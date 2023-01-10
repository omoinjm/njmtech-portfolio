import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  height: calc(${(props) => props.height}px / 1.4);
`;

const CommingSoon = () => {
   const size = useWindowSize();

   return (
      <Error height={size.height} className="jumbotron">
         <h1 className="display-4">Coming soon...</h1>
         <Link href="/">Go back to site</Link>
      </Error>
   );
};

export default CommingSoon;
