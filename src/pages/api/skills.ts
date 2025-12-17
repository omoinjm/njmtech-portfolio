import { getList } from '@/framework/services/sql.service';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = await getList('skills');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
};

export default handler;
