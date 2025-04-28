import React, { useState } from 'react';
import { CommentList } from './CommentList';
import { AddCommentForm } from './AddCommentForm';
import { useAuth } from '../contexts/AuthContext';

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

interface PostCardProps {
  post: Post;
  onLike: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [reloadComments, setReloadComments] = useState(0);
  const { user } = useAuth();

  const handleLike = async () => {
    if (!user) return;
    setLoading(true);
    await fetch(`/api/posts/${post.id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: user.id })
    });
    setLoading(false);
    onLike();
  };

  const handleDeletePost = async () => {
    if (!user) return;
    if (!confirm('Удалить этот пост?')) return;
    await fetch(`/api/posts/${post.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: user.id })
    });
    onLike();
  };

  return (
    <div className="relative bg-card rounded-xl shadow-card p-0 flex flex-col overflow-hidden transition-all duration-200 hover:scale-[1.01] active:scale-100">
      {user?.id === post.author.id && (
        <button
          onClick={handleDeletePost}
          className="absolute top-2 right-2 text-red-500 hover:text-red-400 z-10"
          title="Удалить пост"
        >
          🗑️
        </button>
      )}
      {post.image && (
        <>
          <img
            src={post.image}
            alt="post"
            className="w-full object-cover max-h-72 aspect-square cursor-pointer"
            onClick={() => setShowImageModal(true)}
          />
          {showImageModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setShowImageModal(false)}>
              <img src={post.image} alt="full" className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl" />
            </div>
          )}
        </>
      )}
      <div className="flex-1 flex flex-col gap-2 p-3 sm:p-4">
        <div className="flex items-center gap-3 mb-2">
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-700 flex items-center justify-center text-accent-purple font-bold text-lg sm:text-xl">
              {post.author.name[0]}
            </div>
          )}
          <div>
            <div className="text-primary-50 font-semibold text-sm sm:text-base">{post.author.name}</div>
            <div className="text-primary-100 text-xs">{new Date(post.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div className="text-primary-50 text-base font-medium break-words line-clamp-3">{post.content}</div>
        <div className="flex gap-4 mt-2">
          <button
            className="text-accent-purple hover:text-accent-blue font-bold flex items-center gap-1 disabled:opacity-50"
            onClick={handleLike}
            disabled={loading}
            title="Лайкнуть"
          >
            ♥ {post.likes}
          </button>
          <button
            className="text-primary-100 font-bold flex items-center gap-1"
            onClick={() => setShowComments(v => !v)}
            title="Комментарии"
          >
            💬 {post.comments.length}
          </button>
        </div>
        {showComments && (
          <>
            <CommentList
              comments={post.comments}
              postId={post.id}
              onCommentDeleted={() => { onLike(); setReloadComments(r => r + 1); }}
              key={reloadComments}
            />
            <AddCommentForm postId={post.id} onCommented={() => { onLike(); setReloadComments(r => r + 1); }} />
          </>
        )}
      </div>
    </div>
  );
}; 