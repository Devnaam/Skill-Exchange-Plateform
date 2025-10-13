import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

// Create a new post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { content, postType, skillId, visibility, imageUrl } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = await prisma.post.create({
      data: {
        userId: userId!,
        content,
        postType: postType || 'TEXT',
        skillId: skillId || null,
        visibility: visibility || 'PUBLIC',
        imageUrl: imageUrl || null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },
        skill: true,
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    res.status(201).json({ post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error creating post' });
  }
};

// Get feed posts
export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { filter, postType } = req.query;

    let where: any = {};

    // Filter by visibility
    if (filter === 'connections') {
      // Get user's connections
      const connections = await prisma.connection.findMany({
        where: {
          OR: [
            { senderId: userId, status: 'ACCEPTED' },
            { receiverId: userId, status: 'ACCEPTED' },
          ],
        },
      });

      const connectedUserIds = connections.map((c) =>
        c.senderId === userId ? c.receiverId : c.senderId
      );

      where.OR = [
        { userId: { in: connectedUserIds }, visibility: { in: ['PUBLIC', 'CONNECTIONS'] } },
        { userId: userId }, // Always show own posts
      ];
    } else {
      // Public feed
      where.visibility = 'PUBLIC';
    }

    // Filter by post type
    if (postType) {
      where.postType = postType;
    }

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
            location: true,
          },
        },
        skill: true,
        likes: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    res.json({ posts });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Server error fetching feed' });
  }
};

// Get user's posts
export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            profileImage: true,
          },
        },
        skill: true,
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ posts });
  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
};

// Delete a post
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error deleting post' });
  }
};

// Like a post
export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId!,
          postId,
        },
      },
    });

    if (existingLike) {
      return res.status(400).json({ error: 'Already liked this post' });
    }

    const like = await prisma.like.create({
      data: {
        userId: userId!,
        postId,
      },
    });

    res.status(201).json({ like });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error liking post' });
  }
};

// Unlike a post
export const unlikePost = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { postId } = req.params;

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: userId!,
          postId,
        },
      },
    });

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ error: 'Server error unliking post' });
  }
};

// Add a comment
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content are required' });
    }

    const comment = await prisma.comment.create({
      data: {
        userId: userId!,
        postId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error adding comment' });
  }
};

// Delete a comment
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id },
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Server error deleting comment' });
  }
};
