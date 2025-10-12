import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const createVouch = async (req: AuthRequest, res: Response) => {
  try {
    const voucherId = req.user?.id;
    const { vouchedId, skillId, comment, rating } = req.body;

    if (!vouchedId) {
      return res.status(400).json({ error: 'User to vouch is required' });
    }

    if (voucherId === vouchedId) {
      return res.status(400).json({ error: 'Cannot vouch for yourself' });
    }

    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: voucherId!, receiverId: vouchedId, status: 'ACCEPTED' },
          { senderId: vouchedId, receiverId: voucherId!, status: 'ACCEPTED' },
        ],
      },
    });

    if (!connection) {
      return res.status(403).json({ error: 'You must be connected to vouch for this user' });
    }

    const existingVouch = await prisma.vouch.findUnique({
      where: {
        voucherId_vouchedId: {
          voucherId: voucherId!,
          vouchedId,
        },
      },
    });

    if (existingVouch) {
      return res.status(400).json({ error: 'You have already vouched for this user' });
    }

    const vouch = await prisma.vouch.create({
      data: {
        voucherId: voucherId!,
        vouchedId,
        skillId: skillId || null,
        comment: comment || null,
        rating: rating || 5,
      },
      include: {
        voucher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({ vouch });
  } catch (error) {
    console.error('Create vouch error:', error);
    res.status(500).json({ error: 'Server error creating vouch' });
  }
};

export const getUserVouches = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const vouches = await prisma.vouch.findMany({
      where: { vouchedId: userId },
      include: {
        voucher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const averageRating = vouches.length > 0
      ? vouches.reduce((sum, v) => sum + v.rating, 0) / vouches.length
      : 0;

    res.json({ vouches, count: vouches.length, averageRating });
  } catch (error) {
    console.error('Get user vouches error:', error);
    res.status(500).json({ error: 'Server error fetching vouches' });
  }
};

export const getMyVouches = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const vouches = await prisma.vouch.findMany({
      where: { voucherId: userId },
      include: {
        vouched: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ vouches });
  } catch (error) {
    console.error('Get my vouches error:', error);
    res.status(500).json({ error: 'Server error fetching vouches' });
  }
};

export const deleteVouch = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const vouch = await prisma.vouch.findUnique({
      where: { id },
    });

    if (!vouch) {
      return res.status(404).json({ error: 'Vouch not found' });
    }

    if (vouch.voucherId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this vouch' });
    }

    await prisma.vouch.delete({
      where: { id },
    });

    res.json({ message: 'Vouch removed successfully' });
  } catch (error) {
    console.error('Delete vouch error:', error);
    res.status(500).json({ error: 'Server error deleting vouch' });
  }
};
