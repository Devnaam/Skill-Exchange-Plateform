import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Get all skills (master list)
export const getAllSkills = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId, search } = req.query;
    
    const where: any = {};
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive',
      };
    }

    const skills = await prisma.skill.findMany({
      where,
      include: {
        category: true,
      },
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
    const { name, categoryId, description } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Name and categoryId are required' });
    }

    // Check if skill already exists
    const existingSkill = await prisma.skill.findUnique({
      where: { name },
      include: {
        category: true,
      },
    });

    if (existingSkill) {
      return res.json({ skill: existingSkill });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        categoryId,
        description,
      },
      include: {
        category: true,
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
        skill: {
          include: {
            category: true,
          },
        },
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
    const { skillId, skillName, categoryId, type, proficiencyLevel, description } = req.body;

    if (!type || (type !== 'OFFERED' && type !== 'WANTED')) {
      return res.status(400).json({ error: 'Valid skill type is required' });
    }

    let finalSkillId = skillId;

    // If skillId not provided but skillName is, create or find the skill
    if (!skillId && skillName) {
      let skill = await prisma.skill.findUnique({
        where: { name: skillName },
        include: {
          category: true,
        },
      });

      if (!skill) {
        // If creating a new skill, categoryId is required
        if (!categoryId) {
          return res.status(400).json({ error: 'Category is required for new skills' });
        }

        // Verify category exists
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
        });

        if (!category) {
          return res.status(400).json({ error: 'Invalid category' });
        }

        skill = await prisma.skill.create({
          data: {
            name: skillName,
            categoryId: categoryId,
          },
          include: {
            category: true,
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
        skill: {
          include: {
            category: true,
          },
        },
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
        skill: {
          include: {
            category: true,
          },
        },
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

// Get all categories with skill count
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { skills: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error fetching categories' });
  }
};

// Get skills by category (FIXED - now uses categoryId)
export const getSkillsByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        skills: {
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ 
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
      },
      skills: category.skills,
    });
  } catch (error) {
    console.error('Get skills by category error:', error);
    res.status(500).json({ error: 'Server error fetching skills' });
  }
};
