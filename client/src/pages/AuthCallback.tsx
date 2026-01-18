import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Simulate Google OAuth callback
    // In production, this would receive OAuth tokens from your backend
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      console.error("OAuth error:", error);
      setLocation("/");
      return;
    }

    if (code) {
      // TODO: Exchange code for tokens with backend
      // For now, simulate successful authentication
      const mockUser = {
        email: "user@gmail.com",
        name: "Google User",
        provider: "google",
        id: "google_" + Date.now(),
      };

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", mockUser.email);
      localStorage.setItem("userName", mockUser.name);
      localStorage.setItem("authProvider", "google");
      localStorage.setItem("userId", mockUser.id);

      // Migrate guest data to user account
      const guestCart = localStorage.getItem("archival-ink-cart");
      const guestFavorites = localStorage.getItem("archival-ink-favorites");

      if (guestCart || guestFavorites) {
        // Mark that migration happened
        localStorage.setItem("dataMigrated", "true");
        localStorage.setItem("migrationTimestamp", Date.now().toString());
      }

      // Redirect to home or previous page
      const returnUrl = sessionStorage.getItem("authReturnUrl") || "/";
      sessionStorage.removeItem("authReturnUrl");
      
      setLocation(returnUrl);
      window.location.reload(); // Force reload to update auth state
    } else {
      // No code or error, redirect home
      setLocation("/");
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">Completing sign in...</p>
      </div>
    </div>
  );
}
