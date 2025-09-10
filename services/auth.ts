// services/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const register = async (name: string, email: string, password: string, password_confirmation: string) => {
  try {
    const res = await api.post('/register', { name, email, password, password_confirmation });
    const token = res.data.token;
    await AsyncStorage.setItem('token', token);
    return res.data.user;
  } catch (err: any) {
    console.log(err.response?.data); // ← logs what the backend says
    throw new Error(err.response?.data?.message || 'Registration failed');
  }
};


export const login = async (email: string, password: string) => {
  const res = await api.post('/login', { email, password });
  const token = res.data.access_token;
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('profile', JSON.stringify(res.data.user));
  return res.data.user;
};

export const logout = async () => {
  await api.post('/logout');
  await AsyncStorage.removeItem('token');
};
