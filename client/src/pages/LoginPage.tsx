import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Chrome } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect URL from query params
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get("redirect") || "/";

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login (replace with real authentication)
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      toast.success("Logged in successfully!");
      setLocation(redirectTo);
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Simulate Google OAuth (replace with real OAuth flow)
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", "user@gmail.com");
      localStorage.setItem("authProvider", "google");
      toast.success("Logged in with Google!");
      setLocation(redirectTo);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Archival<span className="text-purple-500">Ink</span>
          </h1>
          <p className="text-gray-400">Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-6 rounded-xl mb-6 flex items-center justify-center gap-3 transition-all"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-400">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white mb-2 block">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500 py-6 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-purple-500 py-6 rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 rounded-xl transition-all"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <a href="#" className="text-sm text-purple-400 hover:text-purple-300 block">
              Forgot password?
            </a>
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => setLocation("/")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
