import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import PrivateRoutes from './components/auth/PrivateRoutes';
import PublicRoutes from './components/auth/PublicRoutes';
import Login from './pages/auth/login';
import NotFoundPage from './pages/NorFoundPage';
import AppLayout from './components/AppLayout';
import { AuthProvider } from './contexts/AuthContext';
import BooksPage from './pages/books';
import MyLoansPage from './pages/loans';
import LibraryAdminPage from './pages/admin/library';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to={'/app'} />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<BooksPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="loans" element={<MyLoansPage />} />
          <Route path="loansAdminPage" element={<LibraryAdminPage />} />
        </Route>
      </Route>
      <Route element={<PublicRoutes />}>
        <Route path="/auth/login" element={<Login />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
