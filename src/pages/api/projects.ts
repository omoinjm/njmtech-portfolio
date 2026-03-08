import { getRecord } from '@/framework/services/sql.service';
import { unstable_cache } from 'next/cache';
import { NextApiRequest, NextApiResponse } from 'next';

const getProjects = async () => {
  return await getRecord('projects');
};

const getCachedLinks =
  process.env.NODE_ENV === 'development'
    ? getProjects // ❌ no caching in dev
    : unstable_cache(async () => await getRecord('projects'), ['projects-links'], {
        tags: ['projects-links-next-js'],
        revalidate: 3600,
      });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await getProjects();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

export default handler;
