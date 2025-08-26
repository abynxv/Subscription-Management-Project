import axios from 'axios';
import { CreateUserData, User } from '../types';

export const usersApi = {
  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await axios.post('/auth/user-register/', userData);
    return response.data;
  },
  
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get('/auth/users/');
    return response.data;
  }
};