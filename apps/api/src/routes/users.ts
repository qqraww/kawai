import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Получить всех пользователей
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, avatar: true } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Получить пользователя по id вместе с постами
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          select: { id: true, content: true, image: true, createdAt: true, likes: true }
        }
      }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Обновить аватар пользователя
router.patch('/:id/avatar', async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, avatar } = req.body;
    if (!authorId || !avatar) {
      return res.status(400).json({ error: 'Missing authorId or avatar' });
    }
    if (authorId !== id) {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }
    const user = await prisma.user.update({
      where: { id },
      data: { avatar }
    });
    res.json({ id: user.id, name: user.name, email: user.email, avatar: user.avatar });
  } catch (error) {
    console.error('Update avatar error:', error);
    res.status(500).json({ error: 'Failed to update avatar' });
  }
});

export default router; 