import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, respondSuccess, respondError } from '@/lib/api-utils';
import { createPropertySchema } from '@/lib/validation';
import { logger } from '@/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const ownerId = (session.user as any).id;
    const body = await req.json();

    const validated = createPropertySchema.parse(body);

    const property = await db.property.create({
      data: {
        ...validated,
        ownerId,
        isApproved: false,
      },
    });

    logger.info('Property created', { propertyId: property.id, ownerId });

    return respondSuccess(
      {
        id: property.id,
        title: property.title,
        status: property.status,
      },
      'Property created successfully',
      201
    );
  } catch (error: any) {
    logger.error('Property creation error', error);
    return respondError(error.message || 'Failed to create property', 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const propertyType = searchParams.get('propertyType');

    const where: any = {
      isApproved: true,
      isArchived: false,
    };

    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (minPrice) where.rentalPrice = { gte: parseInt(minPrice) };
    if (maxPrice) where.rentalPrice = { ...(where.rentalPrice || {}), lte: parseInt(maxPrice) };
    if (bedrooms) where.bedrooms = parseInt(bedrooms);
    if (propertyType) where.propertyType = propertyType;

    const [properties, total] = await Promise.all([
      db.property.findMany({
        where,
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      db.property.count({ where }),
    ]);

    return respondSuccess(
      {
        items: properties,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      'Properties retrieved'
    );
  } catch (error: any) {
    logger.error('Properties fetch error', error);
    return respondError(error.message || 'Failed to fetch properties', 500);
  }
}
