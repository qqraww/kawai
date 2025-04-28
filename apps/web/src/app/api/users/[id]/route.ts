import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, avatar: true, posts: { orderBy: { createdAt: 'desc' }, select: { id: true, content: true, image: true, createdAt: true, likes: true } } }
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (err) {
    console.error('GET /api/users/:id error', err);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
} 