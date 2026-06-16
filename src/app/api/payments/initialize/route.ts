import { NextRequest, NextResponse } from 'next/server';
import { paystackService } from '@/lib/paystack';
import { db } from '@/lib/db';
import { requireAuth, respondSuccess, respondError, validateRequestBody } from '@/lib/api-utils';
import { initiatePaymentSchema } from '@/lib/validation';
import { logger } from '@/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;

    const body = await req.json();
    const validated = initiatePaymentSchema.parse(body);

    // Convert naira to kobo (Paystack uses kobo)
    const amountInKobo = Math.round(validated.amount * 100);

    // Initialize payment
    const paystackResponse = await paystackService.initializePayment({
      amount: amountInKobo,
      email: session.user?.email || '',
      firstName: (session.user as any).firstName,
      lastName: (session.user as any).lastName,
      description: validated.description,
      metadata: {
        userId,
        ...validated.metadata,
      },
    });

    if (!paystackResponse.status || !paystackResponse.data) {
      throw new Error('Failed to initialize payment');
    }

    // Save transaction record
    const transaction = await db.transaction.create({
      data: {
        referenceId: paystackResponse.data.reference,
        buyerId: userId,
        amount: validated.amount,
        currency: validated.currency,
        paymentMethod: 'PAYSTACK',
        status: 'PENDING',
        description: validated.description,
      },
    });

    logger.info('Payment initiated via Paystack', {
      reference: paystackResponse.data.reference,
      amount: validated.amount,
      userId,
    });

    return respondSuccess(
      {
        authorizationUrl: paystackResponse.data.authorization_url,
        accessCode: paystackResponse.data.access_code,
        reference: paystackResponse.data.reference,
        transactionId: transaction.id,
      },
      'Payment initialized successfully',
      200
    );
  } catch (error: any) {
    logger.error('Payment initialization error', error);
    return respondError(
      error.message || 'Failed to initialize payment',
      error.statusCode || 500,
      error.errors
    );
  }
}
