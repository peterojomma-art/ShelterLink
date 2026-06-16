import { NextRequest, NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';
import { db } from '@/lib/db';
import { logger } from '@/utils/logger';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    const body = await req.text();
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
      .update(body)
      .digest('hex');

    const signature = req.headers.get('x-paystack-signature');
    if (hash !== signature) {
      logger.warn('Invalid Paystack webhook signature');
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { reference, customer, amount } = event.data;

      // Verify payment
      const verification = await paystackService.verifyPayment(reference);

      if (verification.status && verification.data?.status === 'success') {
        // Update transaction
        const transaction = await db.transaction.update({
          where: { referenceId: reference },
          data: {
            status: 'COMPLETED',
            processedAt: new Date(),
          },
        });

        // Update wallet
        if (transaction.buyerId) {
          await db.wallet.upsert({
            where: { userId: transaction.buyerId },
            update: {
              balance: {
                increment: transaction.netAmount,
              },
              totalEarned: {
                increment: transaction.netAmount,
              },
            },
            create: {
              userId: transaction.buyerId,
              balance: transaction.netAmount,
              totalEarned: transaction.netAmount,
              currency: transaction.currency,
            },
          });
        }

        logger.info('Payment confirmed via webhook', {
          reference,
          amount: amount / 100, // Convert from kobo to naira
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Webhook processing error', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
