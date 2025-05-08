import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import API_URL from '@/api/config';
import { useUserStore } from '@/stores/userStore';

const userLogout = async () => {
  const res = await axios.post(
    `${API_URL}/auth/logout`,
    {},
    { withCredentials: true }
  );
  return res.data;
};

// 🔁 ✅ Ajout du paramètre navigate
const useLogout = (navigate: (path: string) => void) => {
  const { setUser } = useUserStore();

  const { mutate: logout, isPending: logoutLoading } = useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      setUser({
        id: '',
        picture: '',
        username: '',
        email: '',
        role: '',
      });
      navigate('/'); // ✅ Redirection vers "/"
    },
  });

  return {
    logout,
    logoutLoading,
  };
};

export default useLogout;
