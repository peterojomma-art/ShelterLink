import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, respondSuccess, respondError } from '@/lib/api-utils';
import { createArtisanProfileSchema } from '@/lib/validation';
import { logger } from '@/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;
    const body = await req.json();

    const validated = createArtisanProfileSchema.parse(body);

    const profile = await db.artisanProfile.create({
      data: {
        userId,
        ...validated,
      },
    });

    // Update user role
    await db.user.update({
      where: { id: userId },
      data: { role: 'ARTISAN' },
    });

    logger.info('Artisan profile created', { userId });

    return respondSuccess(
      {
        id: profile.id,
        businessName: profile.businessName,
        isVerified: profile.isVerified,
      },
      'Artisan profile created. Awaiting verification.',
      201
    );
  } catch (error: any) {
    logger.error('Artisan profile creation error', error);
    return respondError(error.message || 'Failed to create artisan profile', 500);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const artisan = await db.artisanProfile.findUnique({
      where: { userId: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatar: true,
            verificationStatus: true,
          },
        },
      },
    });

    if (!artisan) {
      return respondError('Artisan not found', 404);
    }

    return respondSuccess(artisan, 'Artisan profile retrieved');
  } catch (error: any) {
    logger.error('Artisan fetch error', error);
    return respondError(error.message || 'Failed to fetch artisan', 500);
  }
}
