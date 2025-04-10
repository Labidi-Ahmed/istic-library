import React from 'react';
import { Book } from '../../types/book';

interface BookCardProps {
  book: Book;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onBorrow: (id: number) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete, onBorrow }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
          <p className="text-gray-600">{book.author}</p>
          <p className="text-sm text-gray-500">
            {book.published_date ? new Date(book.published_date).toLocaleDateString() : ''}
          </p>
        </div>
        <span
          className={`px-2 py-1 text-sm rounded-full ${
            book.available
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {book.available ? 'Disponible' : 'Emprunté'}
        </span>
      </div>
      
      <p className="mt-2 text-gray-700 line-clamp-2">{book.description}</p>
      
      <div className="mt-4 flex gap-2 justify-end">
        <button
          onClick={() => onEdit(book.id)}
          className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
        >
          Supprimer
        </button>
        {book.available && (
          <button
            onClick={() => onBorrow(book.id)}
            className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100"
          >
            Emprunter
          </button>
        )}
      </div>
    </div>
  );
};