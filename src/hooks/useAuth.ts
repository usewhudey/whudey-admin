import { useAppSelector } from './useAppDispatch';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    state => state.auth
  );

  // if (isLoading) {
  //   // Return the basic state while loading
  //   return {
  //     isLoading: true,
  //   };
  // }

  const currentUser = user;

  // console.log('current user 2', currentUser);

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: currentUser?.role === 'admin',
    isSeller: currentUser?.role === 'seller',
    isEmailVerified: currentUser?.isEmailVerified || false,
  };
};
