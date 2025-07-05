import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: searchParams.get("role") || "patient",
    // Additional fields for therapists
    specialization: "",
    yearsOfExperience: "",
    licenseNumber: "",
    clinicName: "",
    clinicAddress: "",
    // Additional fields for patients
    dateOfBirth: "",
    medicalHistory: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate required fields for therapists
    if (formData.role === "physiotherapist") {
      if (
        !formData.specialization ||
        !formData.licenseNumber ||
        !formData.yearsOfExperience ||
        !formData.clinicName ||
        !formData.clinicAddress ||
        !formData.phone
      ) {
        setError(
          "Please fill in all required fields for therapist registration"
        );
        return;
      }
    }

    setLoading(true);

    try {
      const user = await register(formData);

      // Show success message
      toast.success("Registration successful! Redirecting to login...", {
        duration: 2000,
        style: {
          background: "#10b981",
          color: "#fff",
          fontWeight: "600",
        },
      });

      // Wait for the toast to be visible, then redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900">
      {/* Background Elements with Dark Theme */}
      <div className="absolute inset-0">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-center bg-cover opacity-15"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-slate-900/85" />

        {/* Floating decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-50">
          <div className="absolute rounded-full top-20 left-20 w-72 h-72 bg-primary/8 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute rounded-full top-40 right-20 w-72 h-72 bg-blue-600/8 mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute rounded-full bottom-20 left-40 w-72 h-72 bg-teal-500/8 mix-blend-multiply filter blur-3xl"></div>
        </div>

        {/* Floating geometric shapes */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-16 h-16 border rounded-lg top-32 left-32 bg-primary/15 backdrop-blur-sm border-primary/25"
        />
        <motion.div
          animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-12 h-12 border rounded-full bottom-32 right-32 bg-blue-400/15 backdrop-blur-sm border-blue-400/25"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl space-y-8"
      >
        <div className="p-8 border shadow-2xl bg-slate-800/90 backdrop-blur-sm rounded-2xl border-slate-700/50">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full shadow-lg bg-gradient-to-r from-primary to-blue-600">
                <span className="text-xl font-bold text-white">P</span>
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary to-blue-400 bg-clip-text">
                Join PhysioMe
              </h2>
              <p className="mt-2 text-slate-300">
                Create your account to start your journey to better health
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium transition-colors text-primary hover:text-blue-400"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="text-red-300 bg-red-900/20 border-red-500/30"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Role Selection */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formData.role === "patient" ? "default" : "outline"}
                  className={`flex-1 font-semibold py-3 rounded-lg transition-all duration-300 ${
                    formData.role === "patient"
                      ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg hover:shadow-xl"
                      : "border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 bg-transparent"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "patient" }))
                  }
                >
                  Patient
                </Button>
                <Button
                  type="button"
                  variant={
                    formData.role === "physiotherapist" ? "default" : "outline"
                  }
                  className={`flex-1 font-semibold py-3 rounded-lg transition-all duration-300 ${
                    formData.role === "physiotherapist"
                      ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg hover:shadow-xl"
                      : "border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 bg-transparent"
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "physiotherapist",
                    }))
                  }
                >
                  Therapist
                </Button>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-slate-200">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-slate-200">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-200">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-slate-200">
                  Phone number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-200">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-slate-200">
                  Confirm password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                />
              </div>

              {/* Additional fields for therapists */}
              {formData.role === "physiotherapist" && (
                <>
                  <div>
                    <Label htmlFor="specialization" className="text-slate-200">
                      Specialization
                    </Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      type="text"
                      required
                      value={formData.specialization}
                      onChange={handleChange}
                      className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="licenseNumber" className="text-slate-200">
                      License Number
                    </Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="yearsOfExperience"
                      className="text-slate-200"
                    >
                      Years of Experience
                    </Label>
                    <Input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      required
                      value={formData.yearsOfExperience}
                      onChange={handleChange}
                      className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clinicName" className="text-slate-200">
                      Clinic Name
                    </Label>
                    <Input
                      id="clinicName"
                      name="clinicName"
                      type="text"
                      required
                      value={formData.clinicName}
                      onChange={handleChange}
                      className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clinicAddress" className="text-slate-200">
                      Clinic Address
                    </Label>
                    <Input
                      id="clinicAddress"
                      name="clinicAddress"
                      type="text"
                      required
                      value={formData.clinicAddress}
                      onChange={handleChange}
                      className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </>
              )}

              {/* Additional fields for patients */}
              {formData.role === "patient" && (
                <>
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-slate-200">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medicalHistory" className="text-slate-200">
                      Medical History (brief)
                    </Label>
                    <Input
                      id="medicalHistory"
                      name="medicalHistory"
                      type="text"
                      required
                      value={formData.medicalHistory}
                      onChange={handleChange}
                      className="mt-1 text-white bg-slate-700/50 border-slate-600 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </>
              )}
            </div>

            <Button
              type="submit"
              className="w-full py-3 font-semibold text-white transition-all duration-300 rounded-lg shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
