import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/auth/useAuth';
import API_URL from '@/api/config';

interface Book {
  id: number;
  title: string;
  author: string;
}

interface Loan {
  id: number;
  book_id: number;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
}

const MyLoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Record<number, Book>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserLoans();
    }
  }, [user]);

  const fetchUserLoans = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/loans/user/${user.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }

      const data: Loan[] = await response.json();
      setLoans(data);

      // Fetch book info for each loan
      data.forEach((loan) => {
        if (!books[loan.book_id]) {
          (async () => {
            try {
              const res = await fetch(`http://localhost:7000/api/books/${loan.book_id}`);
              if (!res.ok) throw new Error('Failed to fetch book');
              const book: Book = await res.json();
              setBooks((prev) => ({ ...prev, [loan.book_id]: book }));
            } catch (err) {
              console.error(`Error fetching book ${loan.book_id}:`, err);
            }
          })();
        }
      });
    } catch (error) {
      console.error('Error fetching loans:', error);
      setError('Failed to load loans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const cancelLoan = async (loanId: number) => {
    try {
      const response = await fetch(`${API_URL}/loans/${loanId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel loan');
      }

      await fetchUserLoans();
    } catch (error) {
      console.error('Error canceling loan:', error);
      setError('Failed to cancel loan. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Loans</h1>
        <p className="text-gray-500 text-center">Loading loans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Loans</h1>
        <p className="text-red-500 text-center">{error}</p>
        <Button onClick={fetchUserLoans} className="mt-4 mx-auto block">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Loans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loans.map((loan) => {
          const book = books[loan.book_id];
          return (
            <Card key={loan.id}>
              <CardHeader>
                <CardTitle>{book?.title || 'Loading title...'}</CardTitle>
                <CardDescription>by {book?.author || 'Loading author...'}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Requested on: {new Date(loan.requested_at).toLocaleDateString()}
                </p>
                <p className={`text-sm font-medium mt-2 ${getStatusColor(loan.status)}`}>
                  Status: {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                </p>
              </CardContent>
              <CardFooter>
                {loan.status === 'pending' && (
                  <Button onClick={() => cancelLoan(loan.id)} variant="destructive">
                    Cancel Request
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
        {loans.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">You don't have any loans yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyLoansPage;
