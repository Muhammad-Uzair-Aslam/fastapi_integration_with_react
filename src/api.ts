import axios from 'axios';
import { LoginResponse } from './types';

const BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.url !== '/login') {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('API Request: Added Bearer token to headers', { url: config.url });
  } else {
    console.log('API Request: No token added', { url: config.url });
  }
  return config;
});

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('API Call: Sending login request', { email });
    const response = await apiClient.post<LoginResponse>('/login', { email, password });
    console.log('API Success: Raw login response', response.data);
    if (!response.data.data.access_token || !response.data.data.user) {
      console.error('API Error: Login response missing access_token or user', response.data);
      throw new Error('Invalid login response');
    }
    console.log('API Success: Login response parsed', {
      access_token: response.data.data.access_token,
      user: response.data.data.user,
    });
    return response.data;
  } catch (error) {
    console.error('API Error: Login failed', error);
    throw error;
  }
};

export const sendForgotPasswordEmail = async (email: string): Promise<{ message: string; reset_link: string }> => {
  try {
    console.log('API Call: Sending forgot password request', { email });
    const response = await apiClient.post('/forgot-password', { email });
    console.log('API Success: Forgot password response received', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error: Forgot password request failed', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<{ message: string; reset_link: string }> => {
  try {
    console.log('API Call: Sending password reset request', { email });
    const response = await apiClient.post('/password-reset', { email });
    console.log('API Success: Password reset response received', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error: Password reset request failed', error);
    throw error;
  }
};