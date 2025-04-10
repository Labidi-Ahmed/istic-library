import {Navigate, Outlet} from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Loading from '@/components/Loader';

const PublicRoutes = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? <Navigate to="/app" /> : <Outlet />;
};

export default PublicRoutes;
