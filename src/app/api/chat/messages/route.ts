import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, respondSuccess, respondError } from '@/lib/api-utils';
import { logger } from '@/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;
    const { conversationId, message, attachments } = await req.json();

    if (!conversationId || !message) {
      return respondError('Missing required fields', 400);
    }

    // Verify user is part of conversation
    const conversation = await db.chatConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || (conversation.participant1Id !== userId && conversation.participant2Id !== userId)) {
      return respondError('Unauthorized', 403);
    }

    // Create message
    const newMessage = await db.chatMessage.create({
      data: {
        conversationId,
        senderId: userId,
        message,
        attachments: attachments || [],
        status: 'SENT',
      },
    });

    // Update conversation
    await db.chatConversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessage: message,
      },
    });

    logger.info('Chat message sent', { conversationId, userId });

    return respondSuccess(
      {
        id: newMessage.id,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
      },
      'Message sent',
      201
    );
  } catch (error: any) {
    logger.error('Send message error', error);
    return respondError(error.message || 'Failed to send message', 500);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await requireAuth(req);
    const userId = (session.user as any).id;
    const { conversationId } = params;

    // Verify access
    const conversation = await db.chatConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || (conversation.participant1Id !== userId && conversation.participant2Id !== userId)) {
      return respondError('Unauthorized', 403);
    }

    // Fetch messages
    const messages = await db.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return respondSuccess(messages, 'Messages retrieved');
  } catch (error: any) {
    logger.error('Fetch messages error', error);
    return respondError(error.message || 'Failed to fetch messages', 500);
  }
}
