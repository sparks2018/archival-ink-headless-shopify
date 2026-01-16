import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authProvider");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, logout };
}

export function useRequireAuth(redirectTo = "/login") {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with current path as redirect param
      const currentPath = window.location.pathname;
      setLocation(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoading, redirectTo, setLocation]);

  return { isAuthenticated, isLoading };
}
