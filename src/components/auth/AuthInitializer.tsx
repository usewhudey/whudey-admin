'use client';

import { useEffect } from 'react';
import { useGetCurrentUserQuery } from '@/features/auth/authApi';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setUser, clearUser, setLoading } from '@/features/auth/authSlice';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data: allData, isLoading, isError } = useGetCurrentUserQuery();
  const user = allData?.user;

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else if (isError) {
      dispatch(clearUser());
    } else if (user) {
      dispatch(setUser(user));
    }
  }, [user, isLoading, isError, dispatch]);

  console.log('current userrrr', user);

  return <>{children}</>;
}
