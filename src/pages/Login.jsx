import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { toast } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      toast.success("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      // Handle specific error messages
      if (error.message.includes("pending approval")) {
        setError(
          "Your account is pending approval. Please contact the administrator or wait for approval."
        );
        toast.error("Account pending approval");
      } else {
        setError(
          error.message ||
            "Login failed. Please check your credentials and try again."
        );
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      {/* Background Elements with Dark Theme */}
      <div className="absolute inset-0">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-slate-900/80" />

        {/* Floating decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-60">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-2xl"></div>
          <div className="absolute top-40 right-20 w-64 h-64 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-2xl"></div>
          <div className="absolute bottom-20 left-40 w-64 h-64 bg-teal-500/10 rounded-full mix-blend-multiply filter blur-2xl"></div>
        </div>

        {/* Floating geometric shapes */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-32 w-16 h-16 bg-primary/20 rounded-lg backdrop-blur-sm border border-primary/30"
        />
        <motion.div
          animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-32 w-12 h-12 bg-blue-400/20 rounded-full backdrop-blur-sm border border-blue-400/30"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-slate-800/90 border-slate-700">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <p className="text-slate-300 mt-2">
                Sign in to your PhysioMe account
              </p>
            </motion.div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="mt-2 text-sm text-slate-300">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:text-blue-400 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="mt-4 bg-red-900/20 border-red-500/30 text-red-300"
              >
                <AlertDescription className="flex items-center gap-2">
                  <span>{error}</span>
                  {error.includes("pending approval") && (
                    <Link
                      to="/contact"
                      className="text-sm underline text-red-300 hover:text-red-200"
                    >
                      Contact Support
                    </Link>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-200">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
