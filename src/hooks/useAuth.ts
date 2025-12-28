import { useAppSelector } from './useAppDispatch';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    state => state.auth
  );

  const currentUser = user;

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin:
      currentUser?.role === 'admin' || currentUser?.role === 'superadmin',
    isSeller: currentUser?.role === 'seller',
    isEmailVerified: currentUser?.isEmailVerified || false,
  };
};
