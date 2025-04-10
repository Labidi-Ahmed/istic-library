import React from 'react';
import { Book } from '../../types/book';

interface BookFormProps {
  initialData?: Partial<Book>;
  onSubmit: (data: Partial<Book>) => void;
  onCancel: () => void;
}

export const BookForm: React.FC<BookFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = React.useState({
    title: initialData.title || '',
    author: initialData.author || '',
    description: initialData.description || '',
    published_date: initialData.published_date
      ? new Date(initialData.published_date).toISOString().split('T')[0]
      : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Titre
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
          Auteur
        </label>
        <input
          type="text"
          id="author"
          required
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="published_date" className="block text-sm font-medium text-gray-700">
          Date de publication
        </label>
        <input
          type="date"
          id="published_date"
          value={formData.published_date}
          onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {initialData.id ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};