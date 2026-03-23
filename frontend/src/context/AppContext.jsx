import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticatedState] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const setIsAuthenticated = (value) => {
    setIsAuthenticatedState(value);
    localStorage.setItem('isAuthenticated', value ? 'true' : 'false');
  };

  return (
    <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);