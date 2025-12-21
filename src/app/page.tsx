'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import LoginForm from '@/components/auth/LoginForm';



export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    // Redirect authenticated admins to dashboard
    if (!isLoading && isAuthenticated && isAdmin) {
      router.replace('/dashboard');
    }
    // Redirect non-admins to unauthorized page
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.replace('/');
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Logo at the top */}
        <div className="text-center mb-8">

          <h1 className="mt-4 text-xl font-semibold text-gray-900">
            Whudey Admin Dashboard
          </h1>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-600">
          Whudey Administrative Portal • Secure Access Only
        </p>
      </div>
    </div>
  );
}