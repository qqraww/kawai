import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CreatePostFormProps {
  onPostCreated: () => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setLoading(true);
    setError(null);
    let imageData = image;
    try {
      const res = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          image: imageData,
          authorId: user.id,
        }),
      });
      if (!res.ok) throw new Error('Ошибка при создании поста');
      setContent('');
      setImage(null);
      setFile(null);
      onPostCreated();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <h2 className="text-2xl font-bold text-primary-50 mb-2">Создать пост</h2>
      {error && <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded mb-2 text-sm">{error}</div>}
      <div
        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-accent-purple rounded-xl p-4 bg-primary-800 cursor-pointer hover:bg-primary-700 transition mb-2"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => document.getElementById('image-upload')?.click()}
        style={{ minHeight: 120 }}
      >
        {image ? (
          <img src={image} alt="preview" className="max-h-48 rounded-xl object-contain" />
        ) : (
          <span className="text-primary-100">Перетащите изображение или кликните для выбора файла</span>
        )}
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
      <textarea
        className="input min-h-[80px] resize-none"
        placeholder="Описание поста..."
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {loading ? 'Публикация...' : 'Опубликовать'}
      </button>
    </form>
  );
}; 