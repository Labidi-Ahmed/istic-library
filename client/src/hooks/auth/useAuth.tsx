import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import API_URL from '@/api/config';
import {User, useUserStore} from '@/stores/userStore';
import {useEffect} from 'react';

interface ResData {
  user: User;
  isAuthenticated: boolean;
}

const checkAuth = async () => {
  const response = await axios.get(`${API_URL}/auth/check-auth`, {
    withCredentials: true,
  });
  return response.data as ResData;
};

const useAuth = () => {
  const {setUser} = useUserStore();

  const {data, isLoading} = useQuery({
    queryKey: ['auth'],
    queryFn: checkAuth,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
      console.log(data.user);
    }
  }, [data, setUser]);

  return {
    isAuthenticated: data?.isAuthenticated || false,
    isLoading,
  };
};

export default useAuth;
