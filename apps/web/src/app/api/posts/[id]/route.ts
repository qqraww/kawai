import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { authorId } = await request.json();
    if (!authorId) {
      return NextResponse.json({ error: 'Missing authorId' }, { status: 400 });
    }
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    if (post.authorId !== authorId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }
    await prisma.comment.deleteMany({ where: { postId: id } });
    await prisma.postLike.deleteMany({ where: { postId: id } });
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/posts/:id error:', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
} 