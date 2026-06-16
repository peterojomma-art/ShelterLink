import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireRole, respondSuccess, respondError } from '@/lib/api-utils';
import { logger } from '@/utils/logger';

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'PENDING';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const where = { verificationStatus: status };

    const [requests, total] = await Promise.all([
      db.artisanVerificationRequest.findMany({
        where,
        include: {
          artisan: {
            include: {
              user: true,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      db.artisanVerificationRequest.count({ where }),
    ]);

    return respondSuccess(
      {
        items: requests,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      'Verification requests retrieved'
    );
  } catch (error: any) {
    logger.error('Verification requests fetch error', error);
    return respondError(error.message || 'Failed to fetch requests', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, ['ADMIN']);
    const body = await req.json();
    const { requestId, status, reviewNotes, approvalScore } = body;

    const request = await db.artisanVerificationRequest.update({
      where: { id: requestId },
      data: {
        status,
        reviewedBy: (await requireRole(req, ['ADMIN'])).user?.email,
        reviewedAt: new Date(),
        reviewNotes,
        approvalScore,
      },
    });

    // Update artisan profile if approved
    if (status === 'APPROVED') {
      await db.artisanProfile.update({
        where: { id: request.artisanId },
        data: { isVerified: true },
      });

      // Update user verification status
      await db.user.update({
        where: { id: request.artisanId },
        data: { verificationStatus: 'APPROVED' },
      });
    }

    logger.info('Artisan verification reviewed', {
      artisanId: request.artisanId,
      status,
    });

    return respondSuccess(
      { id: request.id, status: request.status },
      'Verification request processed'
    );
  } catch (error: any) {
    logger.error('Verification review error', error);
    return respondError(error.message || 'Failed to review verification', 500);
  }
}
