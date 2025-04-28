'use client';

import { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import { Feed } from '../components/Feed';
import { CreatePostForm } from '../components/CreatePostForm';
import Link from 'next/link';
import { MainLayout } from '@/components/layouts/MainLayout';

function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-2xl shadow-card p-6 w-full max-w-md relative animate-fade-in">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl text-primary-100 hover:text-accent-purple">×</button>
        {children}
      </div>
    </div>
  );
}

function BottomNav({ onCreate }: { onCreate: () => void }) {
  const { user } = useAuth();
  return (
    <nav className="fixed bottom-0 left-0 w-full z-40 glass border-t border-border/50 flex justify-around items-center py-3 sm:hidden">
      <Link href="/" className="flex flex-col items-center text-primary-100 hover:text-accent-purple transition-all duration-200 group">
        <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
        <span className="text-xs mt-1 group-hover:text-accent-purple">Лента</span>
      </Link>
      <button
        className="flex flex-col items-center text-accent-purple bg-primary-900 rounded-full p-4 text-2xl shadow-lg -mt-12 border-4 border-card hover:scale-110 hover:bg-accent-purple hover:text-white transition-all duration-300"
        onClick={onCreate}
      >
        +
      </button>
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

export default function Home() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return (
      <MainLayout>
        <main className="min-h-screen flex items-center justify-center bg-main-gradient">
          <div className="text-primary-100 text-2xl animate-pulse">Загрузка...</div>
        </main>
      </MainLayout>
    );
  }

  if (isAuthenticated && user) {
    return (
      <MainLayout onCreate={() => setShowModal(true)}>
        <main className="min-h-screen flex flex-col items-center justify-center bg-main-gradient px-1 sm:px-0">
          <div className="w-full max-w-5xl mt-6 sm:mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-50 mb-4 sm:mb-8">Feed</h2>
            <Feed reloadTrigger={reloadTrigger} />
          </div>
          <div className="max-w-xl w-full p-4 sm:p-10 bg-card rounded-2xl shadow-card flex flex-col items-center animate-fade-in mt-8 sm:mt-16">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-primary-50 mb-2">Welcome, <span className="text-accent-purple">{user.name}</span>!</h1>
            <p className="text-center mb-6 sm:mb-8 text-primary-100 text-base sm:text-lg">You are now logged in to <span className="font-bold text-accent-purple">Kawai</span>.</p>
            <button
              onClick={logout}
              className="w-full py-2 px-4 rounded-xl bg-accent-purple hover:bg-accent-blue text-white font-bold shadow-card transition text-base sm:text-lg"
            >
              Logout
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="hidden sm:flex fixed bottom-16 right-4 z-50 bg-accent-purple hover:bg-accent-blue text-white text-4xl rounded-full w-14 h-14 sm:w-16 sm:h-16 items-center justify-center shadow-lg transition-all md:w-20 md:h-20 md:text-5xl"
            title="Создать пост"
          >
            +
          </button>
          <Modal open={showModal} onClose={() => setShowModal(false)}>
            <CreatePostForm onPostCreated={() => { setReloadTrigger(t => t + 1); setShowModal(false); }} />
          </Modal>
        </main>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <main className="min-h-screen flex items-center justify-center bg-main-gradient">
        <div className="max-w-xl w-full p-10 bg-card rounded-2xl shadow-card flex flex-col items-center animate-fade-in">
          <h1 className="text-5xl font-extrabold text-primary-50 mb-2">Welcome to <span className="text-accent-purple">Kawai</span></h1>
          <p className="text-xl text-primary-100 text-center mb-10">Your new social network for sharing moments and connecting with friends</p>
          <div className="flex justify-center space-x-4 mb-10">
            <button
              onClick={() => setShowLogin(true)}
              className={`px-8 py-2 rounded-xl font-bold transition-all duration-200 text-lg ${showLogin ? 'bg-accent-purple text-white scale-105' : 'bg-card text-accent-purple border border-accent-purple hover:bg-primary-700'}`}
            >
              Login
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className={`px-8 py-2 rounded-xl font-bold transition-all duration-200 text-lg ${!showLogin ? 'bg-accent-purple text-white scale-105' : 'bg-card text-accent-purple border border-accent-purple hover:bg-primary-700'}`}
            >
              Register
            </button>
          </div>
          <div className="w-full animate-fade-in">
            {showLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </main>
    </MainLayout>
  );
} 