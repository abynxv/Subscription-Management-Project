import axios from 'axios';
import { CreateUserData, User } from '../types';
import { UpdateUserData } from '../types';

export const usersApi = {
  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await axios.post('/auth/user-register/', userData);
    return response.data;
  },
  
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get('/auth/users/');
    return response.data;
  },

  getUser: async (id: number): Promise<User> => {
    const response = await axios.get(`/auth/users/${id}/`);
    return response.data;
  },

  UpdateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    const response = await axios.put(`/auth/users/${id}/`, data);
    return response.data;
  },

  DeleteUser: async (id: number): Promise<void> => {
    await axios.delete(`/auth/users/${id}/`);
  }
};