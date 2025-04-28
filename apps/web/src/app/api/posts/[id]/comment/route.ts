import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { content, authorId } = await request.json();
    if (!content || !authorId) {
      return NextResponse.json({ error: 'Missing content or authorId' }, { status: 400 });
    }
    const comment = await prisma.comment.create({ data: { content, authorId, postId: id } });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts/:id/comment error:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
} 