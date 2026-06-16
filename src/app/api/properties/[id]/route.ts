import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, respondSuccess, respondError } from '@/lib/api-utils';
import { logger } from '@/utils/logger';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await db.property.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            avatar: true,
            verificationStatus: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                displayName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!property) {
      return respondError('Property not found', 404);
    }

    // Increment views
    await db.property.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return respondSuccess(property, 'Property retrieved');
  } catch (error: any) {
    logger.error('Property fetch error', error);
    return respondError(error.message || 'Failed to fetch property', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;
    const body = await req.json();

    // Check ownership
    const property = await db.property.findUnique({
      where: { id: params.id },
    });

    if (!property || property.ownerId !== userId) {
      return respondError('Unauthorized', 403);
    }

    const updated = await db.property.update({
      where: { id: params.id },
      data: body,
    });

    logger.info('Property updated', { propertyId: params.id, userId });

    return respondSuccess(updated, 'Property updated successfully');
  } catch (error: any) {
    logger.error('Property update error', error);
    return respondError(error.message || 'Failed to update property', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;

    const property = await db.property.findUnique({
      where: { id: params.id },
    });

    if (!property || property.ownerId !== userId) {
      return respondError('Unauthorized', 403);
    }

    await db.property.delete({
      where: { id: params.id },
    });

    logger.info('Property deleted', { propertyId: params.id, userId });

    return respondSuccess({ id: params.id }, 'Property deleted successfully');
  } catch (error: any) {
    logger.error('Property delete error', error);
    return respondError(error.message || 'Failed to delete property', 500);
  }
}
