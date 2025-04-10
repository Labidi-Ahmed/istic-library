import React, { useState } from 'react';
import { BookCard } from '../components/books/BookCard';
import { BookFilters } from '../components/books/BookFilters';
import { BookForm } from '../components/books/BookForm';
import { Book } from '../types/book';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll.ts';
import { Dialog } from '../components/ui/Dialog';

export const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    author: '',
    available: '',
    sortBy: 'title',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<number | null>(null);

  const { loading, hasMore, loadMore } = useInfiniteScroll(async (page: number) => {
    try {
      const response = await fetch(`/api/books?page=${page}&search=${filters.search}&author=${filters.author}&available=${filters.available}&sort=${filters.sortBy}`);
      if (response.ok) {
        const data = await response.json();
        setBooks((prev) => [...prev, ...data]);
        return data;
      }
      return [];
    } catch (error) {
      console.error('Error loading books:', error);
      return [];
    }
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateBook = async (data: Partial<Book>) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const newBook = await response.json();
        setBooks((prev) => [...prev, newBook]);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleUpdateBook = async (data: Partial<Book>) => {
    if (!selectedBook) return;
    try {
      const response = await fetch(`/api/books/${selectedBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const updatedBook = await response.json();
        setBooks((prev) =>
          prev.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        );
        setIsFormOpen(false);
        setSelectedBook(null);
      }
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBooks((prev) => prev.filter((book) => book.id !== id));
        setIsDeleteDialogOpen(false);
        setBookToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleBorrowBook = async (id: number) => {
    try {
      const response = await fetch(`/api/loans/${id}/borrow`, {
        method: 'POST',
      });
      if (response.ok) {
        const updatedBook = await response.json();
        setBooks((prev) =>
          prev.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        );
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bibliothèque</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Ajouter un livre
        </button>
      </div>

      <BookFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={(id) => {
              setSelectedBook(books.find((b) => b.id === id) || null);
              setIsFormOpen(true);
            }}
            onDelete={(id) => {
              setBookToDelete(id);
              setIsDeleteDialogOpen(true);
            }}
            onBorrow={handleBorrowBook}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {hasMore && !loading && (
        <button
          onClick={() => loadMore()}
          className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Charger plus
        </button>
      )}

      <Dialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBook(null);
        }}
        title={selectedBook ? 'Modifier le livre' : 'Ajouter un livre'}
      >
        <BookForm
          initialData={selectedBook || {}}
          onSubmit={selectedBook ? handleUpdateBook : handleCreateBook}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedBook(null);
          }}
        />
      </Dialog>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setBookToDelete(null);
        }}
        title="Confirmer la suppression"
      >
        <div className="p-4">
          <p>Êtes-vous sûr de vouloir supprimer ce livre ?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              onClick={() => bookToDelete && handleDeleteBook(bookToDelete)}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
