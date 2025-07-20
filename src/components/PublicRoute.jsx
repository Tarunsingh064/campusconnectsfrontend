'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/Authcontext/Authcontext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/'); // or redirect to /dashboard
    }
  }, [user, router]);

  if (user) return null; // Prevent flashing form during redirect

  return children;
};

export default PublicRoute;
