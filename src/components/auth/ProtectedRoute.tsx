"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerified?: boolean;
}

export function ProtectedRoute({ children, requireEmailVerified = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, isEmailVerified } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }

    if (!isLoading && isAuthenticated && requireEmailVerified && !isEmailVerified) {
      router.push("/verify-email");
    }
  }, [isAuthenticated, isLoading, isEmailVerified, requireEmailVerified, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireEmailVerified && !isEmailVerified) {
    return null;
  }

  return <>{children}</>;
}
