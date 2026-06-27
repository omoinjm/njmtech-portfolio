import {
   SEOProps,
   generateMetaTags,
   generateOrganizationSchema,
   generatePersonSchema,
   siteConfig,
} from '@/utils/seo';
import Head from 'next/head';
import { ReactNode } from 'react';

interface SEOHeadProps extends SEOProps {
   children?: ReactNode;
   includeStructuredData?: boolean;
   structuredData?: Record<string, unknown>;
}

/**
 * SEO Head Component
 * Handles all meta tags, Open Graph, Twitter cards, and structured data
 */
export function SEOHead({
   title,
   description,
   canonical,
   ogImage,
   ogType,
   twitterHandle,
   keywords,
   author,
   robots,
   viewport,
   children,
   includeStructuredData = true,
   structuredData,
}: SEOHeadProps) {
   const metaTags = generateMetaTags({
      title,
      description,
      canonical,
      ogImage,
      ogType,
      twitterHandle,
      keywords,
      author,
      robots,
      viewport,
   });

   return (
      <Head>
         <title>{title}</title>

         {/* Standard Meta Tags */}
         {metaTags.map((tag) => {
            if (tag.property) {
               return (
                  <meta key={tag.key} property={tag.property} content={tag.content} />
               );
            }
            return <meta key={tag.key} name={tag.name} content={tag.content} />;
         })}

         {/* Canonical URL */}
         {canonical && <link rel="canonical" href={canonical} />}

        {/* Favicon & app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />

         {/* Preconnect to CDN */}
         <link rel="preconnect" href="https://res.cloudinary.com" />
         <link rel="dns-prefetch" href="https://res.cloudinary.com" />

         {/* Structured Data (JSON-LD) */}
         {includeStructuredData && (
            <>
               <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                     __html: JSON.stringify(generatePersonSchema()),
                  }}
               />
               <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                     __html: JSON.stringify(generateOrganizationSchema()),
                  }}
               />
               {structuredData && (
                  <script
                     type="application/ld+json"
                     dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                     }}
                  />
               )}
            </>
         )}

         {/* Google Site Verification */}
         <meta
            name="google-site-verification"
            content="uhCz2o1FOPTi4BlD_3yZ1Nw_ER4VAybFWURc5vBaIVo"
         />

         {/* Additional Children */}
         {children}
      </Head>
   );
}

export default SEOHead;
