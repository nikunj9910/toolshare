import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery } from '../services/api';
import { setCredentials } from '../store/slices/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  
  // Only fetch profile if we have a token but no user data
  const { data: profileData, error } = useGetProfileQuery(undefined, {
    skip: !token || !isAuthenticated,
  });

  useEffect(() => {
    if (profileData?.data && token) {
      // Update the user data in Redux store
      dispatch(setCredentials({
        user: profileData.data,
        token: token,
      }));
    }
  }, [profileData, token, dispatch]);

  return children;
};

export default AuthInitializer;
