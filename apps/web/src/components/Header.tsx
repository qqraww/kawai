"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { usePathname } from 'next/navigation';

const Header: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-pulse-slow">🌸</span>
          <Link href="/" className="text-2xl font-extrabold tracking-wide text-gradient hover:opacity-80 transition">
            Kawai
          </Link>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          {isAuthenticated && user ? (
            <>
              <Link 
                href={`/users/${user?.id}`}
                className="text-primary-50 font-medium hover:text-accent-purple transition-all duration-200 hover:scale-105"
              >
                Profile
              </Link>
              <button 
                onClick={logout} 
                className="btn btn-primary text-sm sm:text-base"
              >
                Logout
              </button>
              <Link href={`/users/${user.id}`} className="group">
                <div className="w-10 h-10 rounded-full bg-card-gradient flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                  <span className="text-accent-purple font-bold text-lg group-hover:text-white transition-colors">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </Link>
            </>
          ) : (
            pathname === '/' && (
              <>
                <Link 
                  href="/" 
                  className="text-primary-50 font-medium hover:text-accent-purple transition-all duration-200 hover:scale-105"
                >
                  Home
                </Link>
                <Link 
                  href="#login" 
                  className="text-primary-50 font-medium hover:text-accent-purple transition-all duration-200 hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  href="#register" 
                  className="btn btn-primary text-sm sm:text-base"
                >
                  Register
                </Link>
              </>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 