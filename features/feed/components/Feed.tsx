import React, { useEffect, useState } from 'react';
import { PostCard } from '../../post/components/PostCard';

interface Author {
  id: string;
  name: string;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLike={fetchPosts} />
      ))}
    </div>
  );
}; 