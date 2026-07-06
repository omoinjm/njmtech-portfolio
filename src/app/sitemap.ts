import type { MetadataRoute } from 'next';
import { siteConfig } from '@/utils/seo';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: siteConfig.url,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${siteConfig.url}/projects`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		{
			url: `${siteConfig.url}/contact`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${siteConfig.url}/mail-service-policy`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${siteConfig.url}/mail-service-terms`,
			lastModified: new Date(),
			changeFrequency: 'yearly',
			priority: 0.3,
		},
	];
}
