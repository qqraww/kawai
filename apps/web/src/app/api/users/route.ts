import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, avatar: true } });
    return NextResponse.json(users);
  } catch (err) {
    console.error('GET /api/users error', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
} 