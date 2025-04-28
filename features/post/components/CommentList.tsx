import React from 'react';

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

interface CommentListProps {
  comments: Comment[];
}

export const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (!comments.length) return <div className="text-primary-100 text-sm">Комментариев пока нет</div>;
  return (
    <div className="flex flex-col gap-2 mt-2">
      {comments.map(comment => (
        <div key={comment.id} className="bg-primary-900 rounded-lg p-2 flex gap-2 items-start">
          <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-accent-purple font-bold text-sm">
            {comment.author.name[0]}
          </div>
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