import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Create a report
export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const reporterId = req.user?.id;
    const { reportedId, reason, description } = req.body;

    if (!reportedId || !reason) {
      return res.status(400).json({ error: 'Reported user and reason are required' });
    }

    if (reporterId === reportedId) {
      return res.status(400).json({ error: 'Cannot report yourself' });
    }

    const report = await prisma.report.create({
      data: {
        reporterId: reporterId!,
        reportedId,
        reason,
        description: description || null,
        status: 'PENDING',
      },
      include: {
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        reported: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(201).json({ report, message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Server error creating report' });
  }
};

// Get reports (admin only - simplified version)
export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        reported: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ reports });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Server error fetching reports' });
  }
};
