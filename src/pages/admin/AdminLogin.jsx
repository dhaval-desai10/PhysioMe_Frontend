import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { toast } from "react-hot-toast";
import apiAdminLogin from "@/services/adminLogin";
import { Shield, Mail, Lock, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Check if already logged in as admin
  useEffect(() => {
    const checkAdminSession = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.role === "admin") {
            setUser(userData);
            navigate("/admin/dashboard", { replace: true });
          }
        } catch (error) {
          console.error("Error checking admin session:", error);
        }
      }
    };

    checkAdminSession();
  }, [navigate, setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use regular login for admin
      const response = await apiAdminLogin.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { user: userData, token } = response.data.data;

        if (userData.role !== "admin") {
          toast.error("Access denied. Admin privileges required.");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast.success("Admin login successful! Welcome to dashboard.", {
          duration: 2000,
          style: {
            background: "#10b981",
            color: "#fff",
            fontWeight: "600",
          },
        });
        navigate("/admin/dashboard");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (loginError) {
      console.log("Login error:", loginError);
      toast.error(
        loginError.response?.data?.message || "Invalid admin credentials"
      );
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-gray-900 via-slate-900 to-black sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(0deg,rgba(0,0,0,0.8),rgba(0,0,0,0.2))] -z-10"></div>

      {/* Background decorative elements */}
      <div className="absolute w-20 h-20 rounded-full top-10 left-10 bg-blue-600/30 mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute w-32 h-32 delay-1000 rounded-full top-32 right-20 bg-cyan-600/30 mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute w-24 h-24 rounded-full bottom-20 left-20 bg-indigo-600/30 mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>

      <Card className="w-full max-w-sm border shadow-2xl border-gray-700/50 bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="pb-6 space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/25">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">
              Admin Access
            </CardTitle>
            <p className="text-xs text-gray-400">
              Secure portal for PhysioMe administrators
            </p>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <Mail className="w-3 h-3" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 text-white transition-all duration-200 border-2 border-gray-600 rounded-lg bg-gray-700/50 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <Lock className="w-3 h-3" />
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 text-white transition-all duration-200 border-2 border-gray-600 rounded-lg bg-gray-700/50 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Access Admin Panel
                </div>
              )}
            </Button>
          </form>

          {/* Security notice */}
          <div className="p-3 mt-4 border border-gray-600 rounded-lg bg-gray-700/50">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-200">
                  Security Notice
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  This is a secure admin portal. All login attempts are
                  monitored and logged.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
