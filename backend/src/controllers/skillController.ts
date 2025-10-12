import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Get all skills (master list)
export const getAllSkills = async (req: AuthRequest, res: Response) => {
  try {
    const { category, search } = req.query;
    
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive',
      };
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });

    res.json({ skills });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Server error fetching skills' });
  }
};

// Create a new skill (admin/auto-create)
export const createSkill = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    // Check if skill already exists
    const existingSkill = await prisma.skill.findUnique({
      where: { name },
    });

    if (existingSkill) {
      return res.json({ skill: existingSkill });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
        description,
      },
    });

    res.status(201).json({ skill });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Server error creating skill' });
  }
};

// Get user's skills (offered and wanted)
export const getUserSkills = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const userSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const skillsOffered = userSkills.filter((us) => us.type === 'OFFERED');
    const skillsWanted = userSkills.filter((us) => us.type === 'WANTED');

    res.json({ skillsOffered, skillsWanted });
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({ error: 'Server error fetching user skills' });
  }
};

// Add skill to user profile
export const addUserSkill = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { skillId, skillName, category, type, proficiencyLevel, description } = req.body;

    if (!type || (type !== 'OFFERED' && type !== 'WANTED')) {
      return res.status(400).json({ error: 'Valid skill type is required' });
    }

    let finalSkillId = skillId;

    // If skillId not provided but skillName is, create or find the skill
    if (!skillId && skillName) {
      let skill = await prisma.skill.findUnique({
        where: { name: skillName },
      });

      if (!skill) {
        skill = await prisma.skill.create({
          data: {
            name: skillName,
            category: category || 'Other',
          },
        });
      }

      finalSkillId = skill.id;
    }

    if (!finalSkillId) {
      return res.status(400).json({ error: 'Skill ID or name is required' });
    }

    // Check if user already has this skill of this type
    const existingUserSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId_type: {
          userId: userId!,
          skillId: finalSkillId,
          type,
        },
      },
    });

    if (existingUserSkill) {
      return res.status(400).json({ error: 'You already have this skill added' });
    }

    const userSkill = await prisma.userSkill.create({
      data: {
        userId: userId!,
        skillId: finalSkillId,
        type,
        proficiencyLevel: proficiencyLevel || null,
        description: description || null,
      },
      include: {
        skill: true,
      },
    });

    res.status(201).json({ userSkill });
  } catch (error) {
    console.error('Add user skill error:', error);
    res.status(500).json({ error: 'Server error adding skill' });
  }
};

// Update user skill
export const updateUserSkill = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { proficiencyLevel, description } = req.body;

    const userSkill = await prisma.userSkill.findUnique({
      where: { id },
    });

    if (!userSkill || userSkill.userId !== userId) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const updatedSkill = await prisma.userSkill.update({
      where: { id },
      data: {
        proficiencyLevel: proficiencyLevel || userSkill.proficiencyLevel,
        description: description !== undefined ? description : userSkill.description,
      },
      include: {
        skill: true,
      },
    });

    res.json({ userSkill: updatedSkill });
  } catch (error) {
    console.error('Update user skill error:', error);
    res.status(500).json({ error: 'Server error updating skill' });
  }
};

// Delete user skill
export const deleteUserSkill = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const userSkill = await prisma.userSkill.findUnique({
      where: { id },
    });

    if (!userSkill || userSkill.userId !== userId) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    await prisma.userSkill.delete({
      where: { id },
    });

    res.json({ message: 'Skill removed successfully' });
  } catch (error) {
    console.error('Delete user skill error:', error);
    res.status(500).json({ error: 'Server error deleting skill' });
  }
};

// Get skills by category
export const getSkillsByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const skills = await prisma.skill.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
    });

    const categories = await prisma.skill.findMany({
      distinct: ['category'],
      select: {
        category: true,
      },
    });

    res.json({ categories: categories.map(c => c.category) });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error fetching categories' });
  }
};
