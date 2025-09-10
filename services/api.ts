// services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// ⚠️ Replace with your computer’s LAN IP so your phone can reach it
// Example: http://192.168.1.100:8000/api
const LOCAL_API = 'http://localhost:8000/api';
const LAN_API = 'http://192.168.100.122:8000/api';

export const API_BASE_URL = Platform.OS === 'web' ? LOCAL_API : LAN_API;
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token from AsyncStorage if available
api.interceptors.request.use(async (config) => {
  let token;
  if (Platform.OS === 'web') {
    token = localStorage.getItem('token');
  } else {
    token = await AsyncStorage.getItem('token');
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
