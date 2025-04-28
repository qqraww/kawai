"use client";

import React, { useState, ChangeEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PostItem {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
}

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    posts: PostItem[];
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  const { user: currentUser, updateAvatar } = useAuth();
  const [preview, setPreview] = useState<string | null>(user.avatar || null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleUpload = async () => {
    if (!file || !currentUser || currentUser.id !== user.id) return;
    setLoading(true);
    try {
      // Send base64 preview as avatar
      await updateAvatar(preview!);
      setFile(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-main-gradient py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card p-6 flex flex-col items-center sm:flex-row gap-6">
          <div className="relative">
            {preview ? (
              <img src={preview} alt="avatar" className="w-32 h-32 rounded-full object-cover shadow-lg" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary-700 flex items-center justify-center text-5xl text-accent-purple font-bold shadow-lg">
                {user.name[0].toUpperCase()}
              </div>
            )}
            {currentUser?.id === user.id && (
              <div className="absolute bottom-0 right-0 bg-card p-1 rounded-full shadow-md cursor-pointer hover:bg-primary-800">
                <label>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <span className="text-xl text-primary-50">📷</span>
                </label>
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-primary-50">{user.name}</h1>
            <p className="text-primary-100 mb-4">{user.email}</p>
            {currentUser?.id === user.id && file && (
              <button onClick={handleUpload} disabled={loading} className="btn btn-primary">
                {loading ? 'Загрузка...' : 'Обновить аватар'}
              </button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-primary-50 mb-4">Посты пользователя</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.posts.map(post => (
              <div key={post.id} className="card p-4 flex flex-col">
                {post.image && <img src={post.image} alt="post" className="w-full h-48 object-cover rounded-lg mb-3" />}
                <div className="text-primary-50 font-medium mb-2 line-clamp-3">{post.content}</div>
                <div className="mt-auto flex items-center justify-between text-sm text-primary-100">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span>♥ {post.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 