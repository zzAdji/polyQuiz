import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [pseudo, setPseudo] = useState(null);
  const [bestScore, setBestScore] = useState(0);

  const updateBestScore = (newScore) => {
    setBestScore(prev => (newScore > prev ? newScore : prev));
  };

  return (
    <UserContext.Provider value={{ pseudo, setPseudo, bestScore, updateBestScore }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé à l\'intérieur d\'un <UserProvider>');
  }
  return context;
}
