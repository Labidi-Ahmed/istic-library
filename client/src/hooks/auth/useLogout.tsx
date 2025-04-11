import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import API_URL from '@/api/config';
import {useUserStore} from '@/stores/userStore';
import {useNavigate} from 'react-router-dom';

const userLogout = async () => {
  const res = await axios.post(
    `${API_URL}/auth/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  return res.data;
};

const useLogout = () => {
  const navigate = useNavigate();

  const {setUser} = useUserStore();

  const {mutate: logout, isPending: logoutLoading} = useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      navigate('/');
      setUser({
        id: '',
        picture: '',
        username: '',
        email: '',
        role: '',
      });
    },
  });

  return {
    logout,
    logoutLoading,
  };
};

export default useLogout;
