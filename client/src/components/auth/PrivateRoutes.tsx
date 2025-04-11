import {Navigate, Outlet} from 'react-router-dom';
import useAuth from '@/hooks/auth/useAuth';
import Loading from '@/components/Loader';

const PrivateRoutes = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoutes;
