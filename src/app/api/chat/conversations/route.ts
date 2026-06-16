import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, respondSuccess, respondError } from '@/lib/api-utils';
import { logger } from '@/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;
    const { participantId, subject, initialMessage } = await req.json();

    if (!participantId || !initialMessage) {
      return respondError('Missing required fields', 400);
    }

    // Create conversation
    const conversation = await db.chatConversation.create({
      data: {
        participant1Id: userId,
        participant2Id: participantId,
        subject,
      },
    });

    // Send initial message
    const message = await db.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: userId,
        message: initialMessage,
        status: 'SENT',
      },
    });

    logger.info('Chat conversation created', {
      conversationId: conversation.id,
      participants: [userId, participantId],
    });

    return respondSuccess(
      {
        conversationId: conversation.id,
        messageId: message.id,
      },
      'Conversation created',
      201
    );
  } catch (error: any) {
    logger.error('Conversation creation error', error);
    return respondError(error.message || 'Failed to create conversation', 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;

    const conversations = await db.chatConversation.findMany({
      where: {
        participant1Id: userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return respondSuccess(
      conversations.map((c) => ({
        id: c.id,
        subject: c.subject,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
        isActive: c.isActive,
      })),
      'Conversations retrieved'
    );
  } catch (error: any) {
    logger.error('Fetch conversations error', error);
    return respondError(error.message || 'Failed to fetch conversations', 500);
  }
}
