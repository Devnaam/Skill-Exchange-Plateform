import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Get personalized matches for the current user
export const getMatches = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { type } = req.query; // 'perfect', 'teachers', 'learners', or undefined for all

    // Get current user's skills
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const offeredSkillIds = currentUser.userSkills
      .filter((us) => us.type === 'OFFERED')
      .map((us) => us.skillId);

    const wantedSkillIds = currentUser.userSkills
      .filter((us) => us.type === 'WANTED')
      .map((us) => us.skillId);

    let matches: any[] = [];

    // Perfect Swaps: Users who offer what I want AND want what I offer
    if (!type || type === 'perfect') {
      const perfectMatches = await prisma.user.findMany({
        where: {
          AND: [
            { id: { not: userId } },
            {
              userSkills: {
                some: {
                  type: 'OFFERED',
                  skillId: { in: wantedSkillIds },
                },
              },
            },
            {
              userSkills: {
                some: {
                  type: 'WANTED',
                  skillId: { in: offeredSkillIds },
                },
              },
            },
          ],
        },
        include: {
          userSkills: {
            include: {
              skill: true,
            },
          },
        },
      });

      matches.push(
        ...perfectMatches.map((user) => ({
          ...user,
          matchType: 'PERFECT_SWAP',
          matchScore: 100,
        }))
      );
    }

    // Teachers: Users who offer what I want to learn
    if (!type || type === 'teachers') {
      const teachers = await prisma.user.findMany({
        where: {
          AND: [
            { id: { not: userId } },
            {
              userSkills: {
                some: {
                  type: 'OFFERED',
                  skillId: { in: wantedSkillIds },
                },
              },
            },
          ],
        },
        include: {
          userSkills: {
            include: {
              skill: true,
            },
          },
        },
      });

      // Filter out perfect matches to avoid duplicates
      const teachersOnly = teachers.filter(
        (teacher) =>
          !matches.find((match) => match.id === teacher.id)
      );

      matches.push(
        ...teachersOnly.map((user) => ({
          ...user,
          matchType: 'TEACHER',
          matchScore: 70,
        }))
      );
    }

    // Learners: Users who want to learn what I offer
    if (!type || type === 'learners') {
      const learners = await prisma.user.findMany({
        where: {
          AND: [
            { id: { not: userId } },
            {
              userSkills: {
                some: {
                  type: 'WANTED',
                  skillId: { in: offeredSkillIds },
                },
              },
            },
          ],
        },
        include: {
          userSkills: {
            include: {
              skill: true,
            },
          },
        },
      });

      // Filter out existing matches
      const learnersOnly = learners.filter(
        (learner) =>
          !matches.find((match) => match.id === learner.id)
      );

      matches.push(
        ...learnersOnly.map((user) => ({
          ...user,
          matchType: 'LEARNER',
          matchScore: 60,
        }))
      );
    }

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Remove sensitive data
    const sanitizedMatches = matches.map((match) => {
      const { password, ...userWithoutPassword } = match;
      return userWithoutPassword;
    });

    res.json({ matches: sanitizedMatches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Server error fetching matches' });
  }
};

// Search users by skills, location, or name
export const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { query, category, location, skillType } = req.query;

    const where: any = {
      id: { not: userId },
    };

    // Search by location
    if (location) {
      where.location = {
        contains: location as string,
        mode: 'insensitive',
      };
    }

    // Search by name or username
    if (query) {
      where.OR = [
        {
          firstName: {
            contains: query as string,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: query as string,
            mode: 'insensitive',
          },
        },
        {
          username: {
            contains: query as string,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Filter by skill category or type
    if (category || skillType) {
      where.userSkills = {
        some: {
          ...(skillType && { type: skillType }),
          ...(category && {
            skill: {
              category: category as string,
            },
          }),
        },
      };
    }

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
        exchangePreference: true,
        userSkills: {
          include: {
            skill: true,
          },
        },
      },
      take: 50,
    });

    res.json({ users });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error searching users' });
  }
};

// Get match details with common skills highlighted
export const getMatchDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { matchId } = req.params;

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userSkills: {
          include: {
            skill: true,
          },
        },
      },
    });

    // Get matched user
    const matchedUser = await prisma.user.findUnique({
      where: { id: matchId },
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

    if (!currentUser || !matchedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate common skills
    const myOffered = currentUser.userSkills
      .filter((us) => us.type === 'OFFERED')
      .map((us) => us.skillId);
    const myWanted = currentUser.userSkills
      .filter((us) => us.type === 'WANTED')
      .map((us) => us.skillId);

    const theirOffered = matchedUser.userSkills
      .filter((us) => us.type === 'OFFERED')
      .map((us) => us.skillId);
    const theirWanted = matchedUser.userSkills
      .filter((us) => us.type === 'WANTED')
      .map((us) => us.skillId);

    // Skills they offer that I want
    const theyCanTeachMe = matchedUser.userSkills.filter(
      (us) => us.type === 'OFFERED' && myWanted.includes(us.skillId)
    );

    // Skills I offer that they want
    const iCanTeachThem = currentUser.userSkills.filter(
      (us) => us.type === 'OFFERED' && theirWanted.includes(us.skillId)
    );

    // Determine match type
    let matchType = 'NO_MATCH';
    if (theyCanTeachMe.length > 0 && iCanTeachThem.length > 0) {
      matchType = 'PERFECT_SWAP';
    } else if (theyCanTeachMe.length > 0) {
      matchType = 'TEACHER';
    } else if (iCanTeachThem.length > 0) {
      matchType = 'LEARNER';
    }

    res.json({
      user: matchedUser,
      matchType,
      theyCanTeachMe,
      iCanTeachThem,
    });
  } catch (error) {
    console.error('Get match details error:', error);
    res.status(500).json({ error: 'Server error fetching match details' });
  }
};
