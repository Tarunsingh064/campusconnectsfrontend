'use client';

import { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const access = Cookies.get('access_token');
    const userData = Cookies.get('user');

    if (access && userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/Auth/login');
    }
  }, []);

  const login = async (username, password) => {
    const res = await axios.post('https://campusconnect-ki0p.onrender.com/api/user/login/', {
      username,
      password,
    });

    const cookieOptions = {
      sameSite: 'Strict',
    };

    Cookies.set('access_token', res.data.access, cookieOptions);
    Cookies.set('refresh_token', res.data.refresh, cookieOptions);
    Cookies.set('user', JSON.stringify(res.data.user), cookieOptions);

    setUser(res.data.user);
    return true;
  };

  const logout = () => {
    console.log('Logging out...');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    setUser(null);
    router.push('/Auth/login');
  };

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = Cookies.get('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url.includes('/login') &&
          !originalRequest.url.includes('/token/refresh')
        ) {
          originalRequest._retry = true;

          const refresh = Cookies.get('refresh_token');
          if (!refresh) {
            console.warn('No refresh token, user probably logged out.');
            return Promise.reject(error);
          }

          try {
            const res = await axios.post('https://campusconnect-ki0p.onrender.com/api/user/token/refresh/', {
              refresh,
            });

            const newAccess = res.data.access;
            Cookies.set('access_token', newAccess, {
              sameSite: 'Strict',
            });

            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return axios(originalRequest);
          } catch (err) {
            logout();
            return Promise.reject(err);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);