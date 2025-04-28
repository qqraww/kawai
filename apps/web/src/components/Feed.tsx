import React, { useEffect, useState } from 'react';
import { PostCard } from './PostCard';

interface Author {
  id: string;
  name: string;
  avatar?: string;
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
}

interface Post {
  id: string;
  content: string;
  image?: string;
  author: Author;
  createdAt: string;
  likes: number;
  comments: Comment[];
}

interface FeedProps {
  reloadTrigger?: number;
}

export const Feed: React.FC<FeedProps> = ({ reloadTrigger }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Always fetch posts from backend API
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Ошибка загрузки ленты');
      const data = await res.json();
      setPosts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, [reloadTrigger]);

  if (loading) return <div className="text-primary-100">Загрузка ленты...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-0">
      <div
        className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 md:gap-8 [column-fill:_balance]"
        style={{
          minHeight: '60vh',
          transition: 'all 0.3s',
        }}
      >
        {posts.map((post) => (
          <div key={post.id} className="mb-4 break-inside-avoid animate-fade-in">
            <PostCard post={post} onLike={fetchPosts} />
          </div>
        ))}
      </div>
    </div>
  );
}; 