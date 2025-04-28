import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Получить все посты (с автором и комментариями)
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true } },
        comments: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Создать пост
router.post('/', async (req, res) => {
  try {
    const { content, image, authorId } = req.body;
    if (!content || !authorId) return res.status(400).json({ error: 'Missing content or authorId' });
    const post = await prisma.post.create({
      data: { content, image, authorId }
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Лайк поста (toggle)
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId } = req.body;
    if (!authorId) {
      return res.status(400).json({ error: 'Missing authorId' });
    }
    // Проверяем, есть ли лайк
    const existing = await prisma.postLike.findUnique({
      where: { userId_postId: { userId: authorId, postId: id } }
    });
    if (existing) {
      // Удаляем лайк (unlike)
      await prisma.postLike.delete({
        where: { userId_postId: { userId: authorId, postId: id } }
      });
      const post = await prisma.post.update({
        where: { id },
        data: { likes: { decrement: 1 } }
      });
      return res.json(post);
    }
    // Добавляем лайк
    await prisma.postLike.create({ data: { userId: authorId, postId: id } });
    const post = await prisma.post.update({
      where: { id },
      data: { likes: { increment: 1 } }
    });
    res.json(post);
  } catch (error) {
    console.error('Like toggle error:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

// Добавить комментарий
router.post('/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, authorId } = req.body;
    if (!content || !authorId) return res.status(400).json({ error: 'Missing content or authorId' });
    const comment = await prisma.comment.create({
      data: { content, authorId, postId: id }
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Удалить пост
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId } = req.body;
    if (!authorId) {
      return res.status(400).json({ error: 'Missing authorId' });
    }
    // Проверяем, является ли автором
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.authorId !== authorId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    // Удаляем комментарии и лайки
    await prisma.comment.deleteMany({ where: { postId: id } });
    await prisma.postLike.deleteMany({ where: { postId: id } });
    // Удаляем пост
    await prisma.post.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Удалить комментарий
router.delete('/:id/comment/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { authorId } = req.body;
    if (!authorId) {
      return res.status(400).json({ error: 'Missing authorId' });
    }
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    if (comment.authorId !== authorId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    await prisma.comment.delete({ where: { id: commentId } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router; 