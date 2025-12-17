import { getRecord } from '@/framework/services/sql.service';
import { unstable_cache } from 'next/cache';
import { NextApiRequest, NextApiResponse } from 'next';

const getCachedLinks = unstable_cache(async () => await getRecord('projects'), ['projects-links'], {
  tags: ['projects-links-next-js'],
  revalidate: 3600,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await getCachedLinks();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

export default handler;
