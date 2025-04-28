import React from 'react';
import UserProfile from '@/components/UserProfile';
import { MainLayout } from '@/components/layouts/MainLayout';

export const dynamic = 'force-dynamic';

export default async function UserPage({ params }: { params: { id: string } }) {
  // Fetch from external API server
  const res = await fetch(`http://localhost:3000/api/users/${params.id}`, { cache: 'no-store' });
  if (!res.ok) {
    return (
      <MainLayout>
        <main className="min-h-screen flex items-center justify-center bg-main-gradient">
          <div className="text-primary-100 text-xl">Пользователь не найден</div>
        </main>
      </MainLayout>
    );
  }
  const userData = await res.json();
  return (
    <MainLayout>
      <UserProfile user={userData} />
    </MainLayout>
  );
} 