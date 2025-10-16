import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, UpdateProfileBody } from '../types';

const prisma = new PrismaClient();

// Get current user's profile
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
        
        // Contact Information
        phone: true,
        website: true,
        
        // Social Media
        linkedin: true,
        twitter: true,
        github: true,
        
        // Personal Details
        languages: true,
        interests: true,
        experienceYears: true,
        
        // Preferences
        availability: true,
        preferredMeetingType: true,
        exchangePreference: true,
        
        // System
        isVerified: true,
        createdAt: true,
        
        // Skills - CORRECTED RELATION NAME
        userSkills: {
          include: {
            skill: {
              include: {
                category: true,
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
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// Update current user's profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
      firstName,
      lastName,
      username,
      email,
      bio,
      location,
      phone,
      website,
      linkedin,
      twitter,
      github,
      languages,
      interests,
      experienceYears,
      availability,
      preferredMeetingType,
      exchangePreference,
    } = req.body as UpdateProfileBody;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate availability
    const validAvailability = ['AVAILABLE', 'BUSY', 'UNAVAILABLE'];
    if (availability && !validAvailability.includes(availability)) {
      return res.status(400).json({ error: 'Invalid availability status' });
    }

    // Validate meeting type
    const validMeetingTypes = ['IN_PERSON', 'ONLINE', 'BOTH'];
    if (preferredMeetingType && !validMeetingTypes.includes(preferredMeetingType)) {
      return res.status(400).json({ error: 'Invalid meeting type' });
    }

    // Check username uniqueness if provided and changed
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Check email uniqueness if changed
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId },
      },
    });

    if (existingEmail) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Parse experience years if provided
    let parsedExperienceYears: number | null = null;
    if (experienceYears !== undefined && experienceYears !== null && experienceYears !== '') {
      parsedExperienceYears = parseInt(experienceYears.toString());
      if (isNaN(parsedExperienceYears) || parsedExperienceYears < 0 || parsedExperienceYears > 70) {
        return res.status(400).json({ error: 'Experience years must be between 0 and 70' });
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username?.trim() || null,
        email: email.trim().toLowerCase(),
        bio: bio?.trim() || null,
        location: location?.trim() || null,
        
        // Contact
        phone: phone?.trim() || null,
        website: website?.trim() || null,
        
        // Social Media
        linkedin: linkedin?.trim() || null,
        twitter: twitter?.trim() || null,
        github: github?.trim() || null,
        
        // Personal
        languages: languages?.trim() || null,
        interests: interests?.trim() || null,
        experienceYears: parsedExperienceYears,
        
        // Preferences
        availability: availability || 'AVAILABLE',
        preferredMeetingType: preferredMeetingType || 'BOTH',
        exchangePreference: exchangePreference || 'FLEXIBLE',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        bio: true,
        location: true,
        profileImage: true,
        
        // Contact
        phone: true,
        website: true,
        
        // Social
        linkedin: true,
        twitter: true,
        github: true,
        
        // Personal
        languages: true,
        interests: true,
        experienceYears: true,
        
        // Preferences
        availability: true,
        preferredMeetingType: true,
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

// Get user by ID (public profile view)
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
        
        // Public contact info
        website: true,
        linkedin: true,
        twitter: true,
        github: true,
        
        // Personal (public)
        languages: true,
        interests: true,
        experienceYears: true,
        
        // Preferences (public)
        availability: true,
        preferredMeetingType: true,
        exchangePreference: true,
        
        // System
        createdAt: true,
        
        // Skills
        userSkills: {
          include: {
            skill: {
              include: {
                category: true,
              },
            },
          },
        },
        
        // Vouches
        receivedVouches: {
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
          take: 5,
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
        // Note: phone number is NOT included in public profile for privacy
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error fetching user' });
  }
};

// Search/Get all users (for discovery)
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      search, 
      location, 
      availability, 
      meetingType,
      limit = '50',
    } = req.query;

    const where: any = {
      // Exclude the current user
      NOT: { id: req.user?.id },
    };

    // Search by name or username
    if (search && typeof search === 'string') {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by location
    if (location && typeof location === 'string') {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Filter by availability
    if (availability && typeof availability === 'string') {
      where.availability = availability;
    }

    // Filter by meeting type preference
    if (meetingType && typeof meetingType === 'string') {
      where.preferredMeetingType = meetingType;
    }

    const limitNum = parseInt(limit as string) || 50;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        bio: true,
        location: true,
        profileImage: true,
        availability: true,
        preferredMeetingType: true,
        createdAt: true,
        userSkills: {
          where: { type: 'OFFERED' },
          include: {
            skill: true,
          },
          take: 3,
        },
      },
      take: limitNum,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ 
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};
