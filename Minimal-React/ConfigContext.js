import React from 'react';

export const ConfigContext = React.createContext();

export const ConfigProvider = ({ children }) => {
  const config = {
    backendURL: process.env.REACT_APP_BACKEND_URL
  };

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};
