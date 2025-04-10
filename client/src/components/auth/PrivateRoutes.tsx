import {Navigate, Outlet} from 'react-router-dom';
import useAuth from '@/hooks/auth/useAuth';
import Loading from '@/components/Loader';
import {useEffect} from 'react';

const PrivateRoutes = () => {
  const {isAuthenticated, isLoading} = useAuth();

  useEffect(() => {}, []);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
