/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://njmtech.vercel.app/',
  generateRobotsTxt: true,
  outDir: './public',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/coming-soon', '/404', '/_error'],
  robotsTxtOptions: {
    sitemaps: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://njmtech.vercel.app'}/sitemap.xml`],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/404', '/_error', '/coming-soon'],
        crawlDelay: 0.5,
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0.3,
      },
    ],
  },
  additionalPaths: async (config) => {
    return [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/projects',
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/contact',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      {
        loc: '/services',
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
    ];
  },
};
