import { NextRequest, NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';
import { db } from '@/lib/db';
import { requireAuth, respondSuccess, respondError } from '@/lib/api-utils';
import { logger } from '@/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;

    const { reference } = await req.json();

    if (!reference) {
      return respondError('Payment reference is required', 400);
    }

    // Verify payment with Paystack
    const verification = await paystackService.verifyPayment(reference);

    if (!verification.status) {
      return respondError('Payment verification failed', 400);
    }

    // Update transaction status
    const transaction = await db.transaction.findUnique({
      where: { referenceId: reference },
    });

    if (!transaction) {
      return respondError('Transaction not found', 404);
    }

    if (transaction.buyerId !== userId) {
      return respondError('Unauthorized', 403);
    }

    if (verification.data?.status === 'success') {
      const updated = await db.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'COMPLETED',
          processedAt: new Date(),
        },
      });

      logger.info('Payment verified', { reference, userId });

      return respondSuccess(
        {
          transactionId: updated.id,
          status: updated.status,
          amount: updated.amount,
        },
        'Payment verified successfully'
      );
    }

    return respondError('Payment not successful', 400);
  } catch (error: any) {
    logger.error('Payment verification error', error);
    return respondError(error.message || 'Verification failed', 500);
  }
}
