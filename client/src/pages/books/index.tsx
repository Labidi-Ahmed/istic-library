import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/auth/useAuth';
import API_URL from '@/api/config';
import Modal from 'react-modal';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string | null;
  available: boolean;
  published_date: string | null;
}

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isModifyModalOpen, setModifyModalOpen] = useState(false);
  const [bookToModify, setBookToModify] = useState<Book | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    published_date: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/books`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const requestLoan = async (bookId: number) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          book_id: bookId,
          user_id: user.id,
        }),
      });

      if (response.ok) {
        fetchBooks();
      }
    } catch (error) {
      console.error('Error requesting loan:', error);
    }
  };

  const openDeleteModal = (book: Book) => {
    setBookToDelete(book);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setBookToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (bookToDelete) {
      try {
        const response = await fetch(`${API_URL}/books/${bookToDelete.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          fetchBooks();
          closeDeleteModal();
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const openModifyModal = (book: Book) => {
    setBookToModify(book);
    setModifyModalOpen(true);
  };

  const closeModifyModal = () => {
    setBookToModify(null);
    setModifyModalOpen(false);
  };

  const modifyBook = async () => {
    if (bookToModify) {
      try {
        const response = await fetch(`${API_URL}/books/${bookToModify.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(bookToModify),
        });

        if (response.ok) {
          fetchBooks();
          closeModifyModal();
        }
      } catch (error) {
        console.error('Error modifying book:', error);
      }
    }
  };

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setNewBook({
      title: '',
      author: '',
      description: '',
      published_date: '',
    });
  };

  const addBook = async () => {
    if (newBook.title && newBook.author) {
      try {
        const response = await fetch(`${API_URL}/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(newBook),
        });

        if (response.ok) {
          fetchBooks();
          closeAddModal();
        }
      } catch (error) {
        console.error('Error adding book:', error);
      }
    } else {
      alert('Title and author are required');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Library Books</h1>
      {user?.role === 'admin' && (
        <Button
          onClick={openAddModal}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white"
        >
          Add New Book
        </Button>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id} className="flex flex-col shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <CardHeader className="bg-gray-100 p-4">
              <CardTitle className="text-xl font-semibold">{book.title}</CardTitle>
              <CardDescription className="text-gray-600">by {book.author}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <p className="text-sm text-gray-600">{book.description || 'No description available'}</p>
              {book.published_date && (
                <p className="text-sm text-gray-500 mt-2">
                  Published: {new Date(book.published_date).toLocaleDateString()}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4">
              <span className={`text-sm ${book.available ? 'text-green-600' : 'text-red-600'}`}>
                {book.available ? 'Available' : 'Not Available'}
              </span>
              {user && book.available && (
                <Button onClick={() => requestLoan(book.id)} variant="default">
                  Request Loan
                </Button>
              )}
              {user?.role === 'admin' && (
                <>
                  <Button onClick={() => openModifyModal(book)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Modify
                  </Button>
                  <Button onClick={() => openDeleteModal(book)} variant="destructive">
                    Delete
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Book Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        ariaHideApp={false}
        className="modal-content max-w-md mx-auto p-6 rounded-lg bg-white shadow-lg"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Add New Book</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            placeholder="Title"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newBook.author}
            onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            placeholder="Author"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={newBook.description}
            onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={newBook.published_date}
            onChange={(e) => setNewBook({ ...newBook, published_date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-center gap-4">
            <Button onClick={addBook} className="bg-green-600 hover:bg-green-700 text-white">
              Add Book
            </Button>
            <Button onClick={closeAddModal} className="bg-gray-400 hover:bg-gray-500 text-white">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        ariaHideApp={false}
        className="modal-content max-w-md mx-auto p-6 rounded-lg bg-white shadow-lg"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Are you sure you want to delete this book?</h2>
        <div className="flex justify-center gap-4">
          <Button onClick={closeDeleteModal} className="bg-gray-400 hover:bg-gray-500 text-white">
            No
          </Button>
          <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
            Yes
          </Button>
        </div>
      </Modal>

      {/* Modify Modal */}
      <Modal
        isOpen={isModifyModalOpen}
        onRequestClose={closeModifyModal}
        ariaHideApp={false}
        className="modal-content max-w-md mx-auto p-6 rounded-lg bg-white shadow-lg"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Modify Book</h2>
        {bookToModify && (
          <div className="space-y-4">
            <input
              type="text"
              value={bookToModify.title}
              onChange={(e) => setBookToModify({ ...bookToModify, title: e.target.value })}
              placeholder="Title"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={bookToModify.author}
              onChange={(e) => setBookToModify({ ...bookToModify, author: e.target.value })}
              placeholder="Author"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={bookToModify.description || ''}
              onChange={(e) => setBookToModify({ ...bookToModify, description: e.target.value })}
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-center gap-4">
              <Button onClick={modifyBook} className="bg-blue-600 hover:bg-blue-700 text-white">
                Save Changes
              </Button>
              <Button onClick={closeModifyModal} className="bg-gray-400 hover:bg-gray-500 text-white">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BooksPage;
