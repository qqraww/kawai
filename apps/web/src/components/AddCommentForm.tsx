import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface AddCommentFormProps {
  postId: string;
  onCommented: () => void;
}

export const AddCommentForm: React.FC<AddCommentFormProps> = ({ postId, onCommented }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorId: user.id })
      });
      if (!res.ok) throw new Error('Ошибка при добавлении комментария');
      setContent('');
      onCommented();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        type="text"
        className="flex-1 rounded-xl border border-primary-700 bg-primary-900 text-primary-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-purple"
        placeholder="Добавить комментарий..."
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={loading}
        required
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-accent-purple hover:bg-accent-blue text-white font-bold shadow-card transition disabled:opacity-50 text-sm"
        disabled={loading || !content.trim()}
      >
        {loading ? '...' : 'Отпр.'}
      </button>
      {error && <div className="text-red-500 text-xs ml-2">{error}</div>}
    </form>
  );
}; 