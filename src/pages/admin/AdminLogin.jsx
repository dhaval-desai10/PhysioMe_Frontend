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
import api from "../../services/api";
import apiAdminLogin from "@/services/adminLogin";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
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
      // First try the direct admin login endpoint
      try {
        const directLoginResponse = await apiAdminLogin.get("/login");

        if (directLoginResponse.data.success) {
          const { user: userData } = directLoginResponse.data.data;
          const token = directLoginResponse.data.data.token;

          // Store token and user data
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));

          // Set user state
          setUser(userData);

          toast.success("Admin login successful");
          navigate("/admin/dashboard");
          return;
        }
      } catch (directLoginError) {
        console.log("Direct admin login failed, trying regular login");
      }

      // Fall back to regular login
      const response = await api.post("/auth/login", { email, password });

      if (response.data.success) {
        const { token, user: userData } = response.data.data;

        // Ensure the user is an admin
        if (userData.role !== "admin") {
          toast.error("Access denied. Admin privileges required.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setLoading(false);
          return;
        }

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Set user state
        setUser(userData);

        toast.success("Admin login successful");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login as Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
