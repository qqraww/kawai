'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface BottomNavProps {
  onCreate?: () => void;
}

export function BottomNav({ onCreate }: BottomNavProps) {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 glass border-t border-border/50 flex justify-around items-center py-3 sm:hidden">
      <Link href="/" className="flex flex-col items-center text-primary-100 hover:text-accent-purple transition-all duration-200 group">
        <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
        <span className="text-xs mt-1 group-hover:text-accent-purple">Лента</span>
      </Link>
      {onCreate && (
        <button
          className="flex flex-col items-center text-accent-purple bg-primary-900 rounded-full p-4 text-2xl shadow-lg -mt-12 border-4 border-card hover:scale-110 hover:bg-accent-purple hover:text-white transition-all duration-300"
          onClick={onCreate}
        >
          +
        </button>
      )}
      {user ? (
        <Link href={`/users/${user.id}`} className="flex flex-col items-center text-primary-100 hover:text-accent-purple transition-all duration-200 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">👤</span>
          <span className="text-xs mt-1 group-hover:text-accent-purple">Профиль</span>
        </Link>
      ) : (
        <Link href="/" className="flex flex-col items-center text-primary-100 hover:text-accent-purple transition-all duration-200 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">👤</span>
          <span className="text-xs mt-1 group-hover:text-accent-purple">Профиль</span>
        </Link>
      )}
    </nav>
  );
} 