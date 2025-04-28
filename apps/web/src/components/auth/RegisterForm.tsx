import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const RegisterForm: React.FC = () => {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <h2 className="text-2xl font-bold text-primary-50 mb-2">Register</h2>
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-2 text-sm">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="username" className="block text-primary-100 text-sm font-medium">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-primary-800 border border-border text-primary-50 focus:outline-none focus:ring-2 focus:ring-accent-purple transition"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-primary-100 text-sm font-medium">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-primary-800 border border-border text-primary-50 focus:outline-none focus:ring-2 focus:ring-accent-purple transition"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="block text-primary-100 text-sm font-medium">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-primary-800 border border-border text-primary-50 focus:outline-none focus:ring-2 focus:ring-accent-purple transition"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 rounded-xl bg-accent-purple hover:bg-accent-blue text-white font-bold mt-2 transition disabled:opacity-60"
      >
        {isLoading ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}; 