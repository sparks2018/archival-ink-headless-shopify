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

export function useRequireAuth(showModal = true) {
  const { isAuthenticated, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && showModal) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated, isLoading, showModal]);

  return { isAuthenticated, isLoading, showLoginModal, setShowLoginModal };
}
