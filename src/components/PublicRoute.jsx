'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const PublicRoute = ({ children }) => {
  const router = useRouter();
  const token = Cookies.get('access_token');

  useEffect(() => {
    if (token) {
      router.replace('/'); // Redirect to homepage or dashboard if logged in
    }
  }, [token, router]);

  if (token) return null; // Prevent showing login while redirecting

  return children;
};

export default PublicRoute;
