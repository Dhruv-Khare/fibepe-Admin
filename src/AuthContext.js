import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  // 3. Initialize state by reading from sessionStorage
  //    The function inside useState runs only on the initial render.
  const [token, setToken] = useState(() => sessionStorage.getItem("authToken"));

  // 4. Use an effect to sync state changes TO sessionStorage
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("authToken", token);
    } else {
      sessionStorage.removeItem("authToken");
    }
  }, [token]); // This effect runs whenever the 'token' state changes

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  // The value provided to consuming components
  const value = { token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};
