import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, respondSuccess, respondError } from '@/lib/api-utils';
import { logger } from '@/utils/logger';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;

    // Check if already favorited
    const existing = await db.favoriteProperty.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId: params.id,
        },
      },
    });

    if (existing) {
      return respondError('Already in favorites', 409);
    }

    const favorite = await db.favoriteProperty.create({
      data: {
        userId,
        propertyId: params.id,
      },
    });

    // Increment property favorites count
    await db.property.update({
      where: { id: params.id },
      data: { favorites: { increment: 1 } },
    });

    logger.info('Property favorited', { propertyId: params.id, userId });

    return respondSuccess({ id: favorite.id }, 'Added to favorites', 201);
  } catch (error: any) {
    logger.error('Favorite error', error);
    return respondError(error.message || 'Failed to add to favorites', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;

    await db.favoriteProperty.delete({
      where: {
        userId_propertyId: {
          userId,
          propertyId: params.id,
        },
      },
    });

    // Decrement property favorites count
    await db.property.update({
      where: { id: params.id },
      data: { favorites: { decrement: 1 } },
    });

    logger.info('Property unfavorited', { propertyId: params.id, userId });

    return respondSuccess(null, 'Removed from favorites');
  } catch (error: any) {
    logger.error('Unfavorite error', error);
    return respondError(error.message || 'Failed to remove from favorites', 500);
  }
}
