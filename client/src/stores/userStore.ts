import {create} from 'zustand';

export interface User {
  id: string;
  picture: string;
  username: string;
  email: string;
  role: string;
}

interface UserStore {
  user: User;
  setUser: (newUser: User) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: {
    id: '',
    picture: '',
    username: '',
    email: '',
    role: '',
  },
  setUser: (newUser: User) => set({user: newUser}),
}));
