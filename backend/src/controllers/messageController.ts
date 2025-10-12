import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Send message
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ error: 'Receiver ID and content are required' });
    }

    // Check if users are connected
    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: senderId!, receiverId, status: 'ACCEPTED' },
          { senderId: receiverId, receiverId: senderId!, status: 'ACCEPTED' },
        ],
      },
    });

    if (!connection) {
      return res.status(403).json({ error: 'You must be connected to send messages' });
    }

    const message = await prisma.message.create({
      data: {
        senderId: senderId!,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error sending message' });
  }
};

// Get conversation with a user
export const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { otherUserId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    res.json({ messages });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Server error fetching conversation' });
  }
};

// Get all conversations (list of users with last message)
export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    // Get all unique users the current user has messaged with
    const sentMessages = await prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    const uniqueUserIds = [
      ...new Set([
        ...sentMessages.map((m) => m.receiverId),
        ...receivedMessages.map((m) => m.senderId),
      ]),
    ];

    // Get last message and unread count for each conversation
    const conversations = await Promise.all(
      uniqueUserIds.map(async (otherUserId) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: userId },
            ],
          },
          orderBy: { createdAt: 'desc' },
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
            receiver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
        });

        const unreadCount = await prisma.message.count({
          where: {
            senderId: otherUserId,
            receiverId: userId,
            isRead: false,
          },
        });

        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        });

        return {
          user: otherUser,
          lastMessage,
          unreadCount,
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => {
      const timeA = a.lastMessage?.createdAt?.getTime() || 0;
      const timeB = b.lastMessage?.createdAt?.getTime() || 0;
      return timeB - timeA;
    });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error fetching conversations' });
  }
};

// Get unread message count
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const unreadCount = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error fetching unread count' });
  }
};
