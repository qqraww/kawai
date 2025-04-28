import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <h2 className="text-2xl font-bold text-primary-50 mb-2">Login to Kawai</h2>
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-2 text-sm">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-primary-100 text-sm font-medium">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-primary-800 border border-border text-primary-50 focus:outline-none focus:ring-2 focus:ring-accent-purple transition"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-primary-100 text-sm font-medium">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-primary-800 border border-border text-primary-50 focus:outline-none focus:ring-2 focus:ring-accent-purple transition"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded-xl bg-accent-purple hover:bg-accent-blue text-white font-bold mt-2 transition"
      >
        Sign in
      </button>
    </form>
  );
}; 