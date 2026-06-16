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
    const body = await req.json();

    // Check property exists
    const property = await db.property.findUnique({
      where: { id: params.id },
    });

    if (!property) {
      return respondError('Property not found', 404);
    }

    // Check if already applied
    const existing = await db.propertyApplication.findUnique({
      where: {
        propertyId_applicantId: {
          propertyId: params.id,
          applicantId: userId,
        },
      },
    });

    if (existing) {
      return respondError('Already applied', 409);
    }

    const application = await db.propertyApplication.create({
      data: {
        propertyId: params.id,
        applicantId: userId,
        ...body,
      },
    });

    logger.info('Property application submitted', {
      propertyId: params.id,
      userId,
    });

    return respondSuccess(
      {
        id: application.id,
        status: application.status,
      },
      'Application submitted',
      201
    );
  } catch (error: any) {
    logger.error('Application submission error', error);
    return respondError(error.message || 'Failed to submit application', 500);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;

    // Verify ownership
    const property = await db.property.findUnique({
      where: { id: params.id },
    });

    if (!property || property.ownerId !== userId) {
      return respondError('Unauthorized', 403);
    }

    const applications = await db.propertyApplication.findMany({
      where: { propertyId: params.id },
      include: {
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    return respondSuccess(applications, 'Applications retrieved');
  } catch (error: any) {
    logger.error('Applications fetch error', error);
    return respondError(error.message || 'Failed to fetch applications', 500);
  }
}
