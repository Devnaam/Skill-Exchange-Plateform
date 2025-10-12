import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, UpdateProfileBody } from '../types';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        bio: true,
        location: true,
        profileImage: true,
        exchangePreference: true,
        isVerified: true,
        createdAt: true,
        userSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Separate offered and wanted skills
    const skillsOffered = user.userSkills.filter(us => us.type === 'OFFERED');
    const skillsWanted = user.userSkills.filter(us => us.type === 'WANTED');

    res.json({ 
      user: {
        ...user,
        skillsOffered,
        skillsWanted,
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const updates: UpdateProfileBody = req.body;

    // Check username uniqueness if provided
    if (updates.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: updates.username },
      });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        bio: true,
        location: true,
        profileImage: true,
        exchangePreference: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        bio: true,
        location: true,
        profileImage: true,
        exchangePreference: true,
        createdAt: true,
        userSkills: {
          include: {
            skill: true,
          },
        },
        receivedVouches: {
          include: {
            voucher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Separate offered and wanted skills
    const skillsOffered = user.userSkills.filter(us => us.type === 'OFFERED');
    const skillsWanted = user.userSkills.filter(us => us.type === 'WANTED');

    res.json({ 
      user: {
        ...user,
        skillsOffered,
        skillsWanted,
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error fetching user' });
  }
};
