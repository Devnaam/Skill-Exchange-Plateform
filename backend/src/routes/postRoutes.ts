import express from 'express';
import {
  createPost,
  getFeed,
  getUserPosts,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
} from '../controllers/postController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Post routes
router.post('/create', authenticate, createPost);
router.get('/feed', authenticate, getFeed);
router.get('/user/:userId', authenticate, getUserPosts);
router.delete('/:id', authenticate, deletePost);

// Like routes
router.post('/like', authenticate, likePost);
router.delete('/unlike/:postId', authenticate, unlikePost);

// Comment routes
router.post('/comment', authenticate, addComment);
router.delete('/comment/:id', authenticate, deleteComment);

export default router;
