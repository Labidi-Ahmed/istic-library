import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/auth/useAuth';

interface Loan {
  id: number;
  book_id: number;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: string;
  user: {
    username: string;
  };
  book: {
    title: string;
  };
}

const LibraryAdminPage = () => {
  const [pendingLoans, setPendingLoans] = useState<Loan[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPendingLoans();
    }
  }, [user]);

  const fetchPendingLoans = async () => {
    try {
      const response = await fetch('/api/loans/status/pending');
      if (response.ok) {
        const data = await response.json();
        setPendingLoans(data);
      }
    } catch (error) {
      console.error('Error fetching pending loans:', error);
    }
  };

  const updateLoanStatus = async (loanId: number, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/loans/${loanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchPendingLoans();
      }
    } catch (error) {
      console.error('Error updating loan status:', error);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Library Administration</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pending Loan Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingLoans.map((loan) => (
            <Card key={loan.id}>
              <CardHeader>
                <CardTitle>{loan.book.title}</CardTitle>
                <CardDescription>Requested by: {loan.user.username}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Requested on: {new Date(loan.requested_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  onClick={() => updateLoanStatus(loan.id, 'approved')}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => updateLoanStatus(loan.id, 'rejected')}
                  variant="destructive"
                >
                  Reject
                </Button>
              </CardFooter>
            </Card>
          ))}
          {pendingLoans.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">No pending loan requests.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default LibraryAdminPage;
