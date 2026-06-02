import { createContext, useCallback, useState } from 'react';
import { apiRequest } from './api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [uiError, setUiError] = useState('');

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await apiRequest('/profile');
      setUserInfo(profile);
      return profile;
    } catch {
      setUserInfo(null);
      return null;
    } finally {
      setAuthChecked(true);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        authChecked,
        setAuthChecked,
        refreshProfile,
        uiError,
        setUiError
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
