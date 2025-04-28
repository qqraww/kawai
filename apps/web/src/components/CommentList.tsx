import React from 'react';
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

interface CommentListProps {
  comments: Comment[];
  postId: string;
  onCommentDeleted?: () => void;
}

export const CommentList: React.FC<CommentListProps> = ({ comments, postId, onCommentDeleted }) => {
  const { user } = useAuth();
  if (!comments.length) return <div className="text-primary-100 text-sm">Комментариев пока нет</div>;
  const handleDelete = async (commentId: string) => {
    if (!user) return;
    if (!confirm('Удалить комментарий?')) return;
    await fetch(`/api/posts/${postId}/comment/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorId: user.id })
    });
    onCommentDeleted && onCommentDeleted();
  };
  return (
    <div className="flex flex-col gap-2 mt-2">
      {comments.map(comment => (
        <div key={comment.id} className="relative bg-primary-900 rounded-lg p-2 flex gap-2 items-start">
          {user?.id === comment.author.id && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="absolute top-1 right-1 text-red-500 hover:text-red-400 z-10"
              title="Удалить комментарий"
            >
              🗑️
            </button>
          )}
          {comment.author.avatar ? (
            <img src={comment.author.avatar} alt={comment.author.name} className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-accent-purple font-bold text-sm">
              {comment.author.name[0]}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-primary-50 font-semibold text-xs">{comment.author.name}</span>
              <span className="text-primary-100 text-xs">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-primary-50 text-sm break-words">{comment.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}; 