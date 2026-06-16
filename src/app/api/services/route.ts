import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, respondSuccess, respondError } from '@/lib/api-utils';
import { logger } from '@/utils/logger';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const isVerified = searchParams.get('isVerified') === 'true';

    const where: any = {
      isActive: true,
    };

    if (category) where.category = category;
    if (isVerified) {
      where.artisan = {
        user: {
          verificationStatus: 'APPROVED',
        },
      };
    }
    if (minPrice) where.basePrice = { gte: parseInt(minPrice) };
    if (maxPrice) where.basePrice = { ...(where.basePrice || {}), lte: parseInt(maxPrice) };

    const [services, total] = await Promise.all([
      db.service.findMany({
        where,
        include: {
          artisan: {
            select: {
              id: true,
              displayName: true,
              avatar: true,
              verificationStatus: true,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { averageRating: 'desc' },
      }),
      db.service.count({ where }),
    ]);

    return respondSuccess(
      {
        items: services,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      'Services retrieved'
    );
  } catch (error: any) {
    logger.error('Services fetch error', error);
    return respondError(error.message || 'Failed to fetch services', 500);
  }
}
