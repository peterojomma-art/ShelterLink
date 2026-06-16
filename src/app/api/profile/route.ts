import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, respondSuccess, respondError } from '@/lib/api-utils';
import { logger } from '@/utils/logger';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;

    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        wallet: true,
        agencyMembership: {
          include: {
            agency: true,
          },
        },
      },
    });

    if (!user) {
      return respondError('User not found', 404);
    }

    return respondSuccess(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
        verificationStatus: user.verificationStatus,
        isActive: user.isActive,
        wallet: user.wallet,
        agencies: user.agencyMembership.map((m) => ({
          id: m.agency.id,
          name: m.agency.name,
          role: m.role,
          isActive: m.isActive,
        })),
      },
      'Profile retrieved successfully'
    );
  } catch (error: any) {
    logger.error('Profile fetch error', error);
    return respondError(error.message || 'Failed to fetch profile', 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;
    const body = await req.json();

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        displayName: body.displayName,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
        zipCode: body.zipCode,
      },
      include: {
        wallet: true,
        agencyMembership: true,
      },
    });

    logger.info('User profile updated', { userId });

    return respondSuccess(
      {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        displayName: updated.displayName,
      },
      'Profile updated successfully'
    );
  } catch (error: any) {
    logger.error('Profile update error', error);
    return respondError(error.message || 'Failed to update profile', 500);
  }
}
