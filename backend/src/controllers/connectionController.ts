import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Send connection request
export const sendConnectionRequest = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { receiverId, message } = req.body;

    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver ID is required' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot connect with yourself' });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if connection already exists
    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: senderId!, receiverId },
          { senderId: receiverId, receiverId: senderId! },
        ],
      },
    });

    if (existingConnection) {
      return res.status(400).json({ error: 'Connection already exists' });
    }

    // Create connection request
    const connection = await prisma.connection.create({
      data: {
        senderId: senderId!,
        receiverId,
        message: message || null,
        status: 'PENDING',
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({ connection });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({ error: 'Server error sending connection request' });
  }
};

// Get all connections (sent, received, accepted)
export const getConnections = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { status } = req.query;

    const where: any = {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    };

    if (status) {
      where.status = status;
    }

    const connections = await prisma.connection.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
            location: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Separate connections
    const sent = connections.filter(
      (c) => c.senderId === userId && c.status === 'PENDING'
    );
    const received = connections.filter(
      (c) => c.receiverId === userId && c.status === 'PENDING'
    );
    const accepted = connections.filter((c) => c.status === 'ACCEPTED');

    res.json({ sent, received, accepted, all: connections });
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ error: 'Server error fetching connections' });
  }
};

// Accept connection request
export const acceptConnection = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const connection = await prisma.connection.findUnique({
      where: { id },
    });

    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    if (connection.receiverId !== userId) {
      return res.status(403).json({ error: 'Not authorized to accept this request' });
    }

    if (connection.status !== 'PENDING') {
      return res.status(400).json({ error: 'Connection request already processed' });
    }

    const updatedConnection = await prisma.connection.update({
      where: { id },
      data: { status: 'ACCEPTED' },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    res.json({ connection: updatedConnection });
  } catch (error) {
    console.error('Accept connection error:', error);
    res.status(500).json({ error: 'Server error accepting connection' });
  }
};

// Reject connection request
export const rejectConnection = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const connection = await prisma.connection.findUnique({
      where: { id },
    });

    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    if (connection.receiverId !== userId) {
      return res.status(403).json({ error: 'Not authorized to reject this request' });
    }

    if (connection.status !== 'PENDING') {
      return res.status(400).json({ error: 'Connection request already processed' });
    }

    const updatedConnection = await prisma.connection.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    res.json({ connection: updatedConnection });
  } catch (error) {
    console.error('Reject connection error:', error);
    res.status(500).json({ error: 'Server error rejecting connection' });
  }
};

// Cancel connection request (for sender)
export const cancelConnection = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const connection = await prisma.connection.findUnique({
      where: { id },
    });

    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }

    if (connection.senderId !== userId) {
      return res.status(403).json({ error: 'Not authorized to cancel this request' });
    }

    await prisma.connection.delete({
      where: { id },
    });

    res.json({ message: 'Connection request cancelled' });
  } catch (error) {
    console.error('Cancel connection error:', error);
    res.status(500).json({ error: 'Server error cancelling connection' });
  }
};

// Get connection status with a specific user
export const getConnectionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { targetUserId } = req.params;

    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: userId },
        ],
      },
    });

    if (!connection) {
      return res.json({ status: 'NONE', connection: null });
    }

    const isSender = connection.senderId === userId;
    
    res.json({
      status: connection.status,
      isSender,
      connection,
    });
  } catch (error) {
    console.error('Get connection status error:', error);
    res.status(500).json({ error: 'Server error fetching connection status' });
  }
};
