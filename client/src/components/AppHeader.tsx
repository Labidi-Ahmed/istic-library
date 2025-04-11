import { Button } from "./ui/button";
import { useEffect } from 'react';
import useAuth from "@/hooks/auth/useAuth";
import { Link } from "react-router-dom";
import { UserMenu } from "./auth/UserMenu";

export function AppHeader() {
  const { user } = useAuth();
  useEffect(() => {
    console.log(user);
  }, []);
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          <Link to="/app" className="flex items-center space-x-2">
            <span className="inline-block font-bold">ISTIC Library</span>
          </Link>
          <nav className="flex gap-6">
            <Link to="/app/books" className="flex items-center text-sm font-medium">
              Books
            </Link>
            {user && (
              <Link to="/app/loans" className="flex items-center text-sm font-medium">
                My Loans
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/app/admin/library" className="flex items-center text-sm font-medium">
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <UserMenu />
          ) : (
            <Link to="/auth/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
