import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { authorId } = await request.json();
    if (!authorId) {
      return NextResponse.json({ error: 'Missing authorId' }, { status: 400 });
    }
    const existing = await prisma.postLike.findUnique({
      where: { userId_postId: { userId: authorId, postId: id } }
    });
    if (existing) {
      // unlike
      await prisma.postLike.delete({ where: { userId_postId: { userId: authorId, postId: id } } });
      const post = await prisma.post.update({ where: { id }, data: { likes: { decrement: 1 } } });
      return NextResponse.json(post);
    }
    // like
    await prisma.postLike.create({ data: { userId: authorId, postId: id } });
    const post = await prisma.post.update({ where: { id }, data: { likes: { increment: 1 } } });
    return NextResponse.json(post);
  } catch (error) {
    console.error('POST /api/posts/:id/like error', error);
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 });
  }
} 