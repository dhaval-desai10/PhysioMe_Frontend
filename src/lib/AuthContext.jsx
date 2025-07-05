import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Configure axios defaults
  axios.defaults.baseURL = "https://physiome-backend.onrender.com/api";
  axios.defaults.withCredentials = true;

  // Add request interceptor to include token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);

        // Only redirect to login if not already on login pages
        if (!location.pathname.includes("/login")) {
          if (location.pathname.includes("/admin")) {
            navigate("/admin/login");
          } else {
            navigate("/login");
          }
        }
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Set user from localStorage first
      setUser(JSON.parse(storedUser));

      // Verify token with backend
      const response = await axios.get("/auth/me");
      if (response.data.success) {
        const userData = response.data.data;

        // Update stored user data
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // Only redirect if explicitly on a login page (not after registration)
        if (
          location.pathname === "/login" ||
          location.pathname === "/admin/login"
        ) {
          const dashboardPath =
            userData.role === "admin"
              ? "/admin/dashboard"
              : userData.role === "patient"
              ? "/patient/dashboard"
              : "/therapist/dashboard";
          navigate(dashboardPath, { replace: true });
        }
      } else {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/auth/register", userData);
      if (response.data.success) {
        // For registration, we just return the user data but don't auto-login
        // The user will need to login manually after registration
        const responseData = response.data.data;

        // Handle both old and new response formats
        if (responseData.user) {
          return responseData.user; // New format with token and user
        } else {
          return responseData; // Old format with just user data
        }
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post("/auth/login", credentials);
      if (response.data.success) {
        const { token, user: userData } = response.data.data;

        // Store token and user data
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Set user state
        setUser(userData);

        // Determine the appropriate dashboard path based on role
        let dashboardPath;
        if (userData.role === "admin") {
          dashboardPath = "/admin/dashboard";
        } else if (userData.role === "patient") {
          dashboardPath = "/patient/dashboard";
        } else if (userData.role === "physiotherapist") {
          // For therapists, they can always access their dashboard
          dashboardPath = "/therapist/dashboard";
        }

        // Use window.location.href for a full page reload
        window.location.href = dashboardPath;

        return userData;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Clear any existing auth data
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Handle specific error cases
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("Login failed. Please try again later.");
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    setUser,
    isAuthenticated: !!user,
    isPatient: user?.role === "patient",
    isTherapist: user?.role === "physiotherapist",
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
