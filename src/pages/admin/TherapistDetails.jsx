import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../services/api";
import { useAuth } from "../../lib/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Loader2,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Clock,
  MapPin,
  Award,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const TherapistDetails = () => {
  const { id: therapistId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!token) {
        navigate("/admin/login");
        return false;
      }

      if (user.role !== "admin") {
        navigate("/admin/login");
        return false;
      }

      return true;
    };

    if (checkAuth() && therapistId) {
      fetchTherapistDetails();
    } else if (!therapistId) {
      setError("Therapist ID is missing");
      setLoading(false);
    }
  }, [therapistId, navigate]);

  // Add effect to refresh when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && therapistId) {
        fetchTherapistDetails();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [therapistId]);

  const fetchTherapistDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApi.getTherapistDetails(therapistId);

      if (response.data?.success) {
  
        setTherapist(response.data.data);
      } else {
        throw new Error("Therapist data not found");
      }
    } catch (err) {
      console.error("Error fetching therapist details:", err);
      if (err.message === "Authentication required") {
        navigate("/admin/login");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch therapist details"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      const response = await adminApi.approveTherapist(therapistId);

      if (response.data?.success) {
        // Immediately update local state
        setTherapist((prev) => ({
          ...prev,
          status: "approved",
        }));
        toast.success("Therapist approved successfully");

        // Fetch fresh data from backend to ensure consistency
        setTimeout(() => {
          fetchTherapistDetails();
        }, 1000);
      } else {
        throw new Error("Failed to approve therapist");
      }
    } catch (err) {
      console.error("Error approving therapist:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to approve therapist"
      );
      // Refresh data on error to show current state
      fetchTherapistDetails();
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      const response = await adminApi.rejectTherapist(therapistId);

      if (response.data?.success) {
        // Immediately update local state
        setTherapist((prev) => ({
          ...prev,
          status: "rejected",
        }));
        toast.success("Therapist rejected successfully");

        // Fetch fresh data from backend to ensure consistency
        setTimeout(() => {
          fetchTherapistDetails();
        }, 1000);
      } else {
        throw new Error("Failed to reject therapist");
      }
    } catch (err) {
      console.error("Error rejecting therapist:", err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to reject therapist"
      );
      // Refresh data on error to show current state
      fetchTherapistDetails();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">
            Loading therapist details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container px-4 mx-auto">
          <Card className="max-w-2xl mx-auto border-red-200 shadow-lg">
            <CardContent className="py-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-red-600">Error</h2>
                <p className="mb-6 text-red-500">{error}</p>
                <Button
                  onClick={() => navigate("/admin/dashboard")}
                  className="text-white bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container px-4 mx-auto">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardContent className="py-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-600">
                  Not Found
                </h2>
                <p className="mb-6 text-gray-500">Therapist not found</p>
                <Button
                  onClick={() => navigate("/admin/dashboard")}
                  className="text-white bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="p-6 mb-8 border shadow-lg bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/admin/dashboard")}
                className="transition-all duration-300 border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 hover:shadow-md"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
                  Therapist Details
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Review and manage therapist information
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Personal Information */}
          <Card className="transition-all duration-300 shadow-lg bg-gradient-to-br from-card to-card/80 border-primary/20 hover:shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-blue-500/5 to-blue-600/10 border-blue-500/20">
              <CardTitle className="flex items-center text-xl text-blue-700 dark:text-blue-300">
                <div className="p-2 mr-3 rounded-full bg-blue-500/10">
                  <User className="w-5 h-5 text-blue-500" />
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start space-x-6">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 overflow-hidden border-4 rounded-full shadow-lg border-primary/30">
                    {therapist.profilePictureUrl ? (
                      <img
                        src={therapist.profilePictureUrl}
                        alt={therapist.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 to-primary/40">
                        <span className="text-3xl font-bold text-primary">
                          {therapist.name?.charAt(0) || "T"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute flex items-center justify-center w-8 h-8 bg-green-500 border-4 rounded-full -bottom-1 -right-1 border-card">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-3 text-2xl font-bold truncate text-foreground">
                    {therapist.name || "Unknown Therapist"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                      <Mail className="flex-shrink-0 w-4 h-4 mr-3 text-primary" />
                      <span className="text-sm truncate text-muted-foreground">
                        {therapist.email || "No email provided"}
                      </span>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-gradient-to-r from-green-500/5 to-green-600/10">
                      <Phone className="flex-shrink-0 w-4 h-4 mr-3 text-green-600" />
                      <span className="text-sm text-muted-foreground">
                        {therapist.phone || "No phone number"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="transition-all duration-300 shadow-lg bg-gradient-to-br from-card to-card/80 border-primary/20 hover:shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-purple-500/5 to-purple-600/10 border-purple-500/20">
              <CardTitle className="flex items-center text-xl text-purple-700 dark:text-purple-300">
                <div className="p-2 mr-3 rounded-full bg-purple-500/10">
                  <Award className="w-5 h-5 text-purple-500" />
                </div>
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="p-4 border border-indigo-200 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30 dark:border-indigo-700">
                  <h4 className="flex items-center mb-2 font-semibold text-indigo-700 dark:text-indigo-300">
                    <Award className="w-4 h-4 mr-2" />
                    Specialization
                  </h4>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {therapist.specialization || "Not specified"}
                  </p>
                </div>
                <div className="p-4 border border-teal-200 rounded-lg bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/30 dark:border-teal-700">
                  <h4 className="flex items-center mb-2 font-semibold text-teal-700 dark:text-teal-300">
                    <Clock className="w-4 h-4 mr-2" />
                    Experience
                  </h4>
                  <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
                    {therapist.experience || 0} years
                  </p>
                </div>
              </div>

              <div className="p-4 border border-orange-200 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 dark:border-orange-700">
                <h4 className="flex items-center mb-2 font-semibold text-orange-700 dark:text-orange-300">
                  <FileText className="w-4 h-4 mr-2" />
                  License Number
                </h4>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {therapist.licenseNumber || "Not provided"}
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-gradient-to-r from-cyan-50 to-cyan-100 border-cyan-200 dark:from-cyan-900/20 dark:to-cyan-800/30 dark:border-cyan-700">
                <h4 className="flex items-center mb-2 font-semibold text-cyan-700 dark:text-cyan-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  Clinic Information
                </h4>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                    <span className="font-semibold">Name:</span>{" "}
                    {therapist.clinicName || "Not provided"}
                  </p>
                  <p className="text-sm text-cyan-600 dark:text-cyan-400">
                    <span className="font-semibold">Address:</span>{" "}
                    {therapist.clinicAddress || "Not provided"}
                  </p>
                </div>
              </div>

              {therapist.bio && (
                <div className="p-4 border rounded-lg bg-gradient-to-r from-violet-50 to-violet-100 border-violet-200 dark:from-violet-900/20 dark:to-violet-800/30 dark:border-violet-700">
                  <h4 className="flex items-center mb-2 font-semibold text-violet-700 dark:text-violet-300">
                    <FileText className="w-4 h-4 mr-2" />
                    Professional Bio
                  </h4>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-violet-600 dark:text-violet-400">
                    {therapist.bio}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card className="transition-all duration-300 shadow-lg bg-gradient-to-br from-card to-card/80 border-primary/20 hover:shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-amber-500/5 to-amber-600/10 border-amber-500/20">
              <CardTitle className="flex items-center text-xl text-amber-700 dark:text-amber-300">
                <div className="p-2 mr-3 rounded-full bg-amber-500/10">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                Working Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-4 border rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/30 dark:border-emerald-700">
                <h4 className="flex items-center mb-3 font-semibold text-emerald-700 dark:text-emerald-300">
                  <Clock className="w-4 h-4 mr-2" />
                  Working Days
                </h4>
                <div className="flex flex-wrap gap-2">
                  {therapist.workingDays && therapist.workingDays.length > 0 ? (
                    therapist.workingDays.map((day, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs font-medium text-white rounded-full shadow-sm bg-gradient-to-r from-emerald-500 to-emerald-600"
                      >
                        {day}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm italic text-emerald-600 dark:text-emerald-400">
                      Not specified
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 dark:border-blue-700">
                <h4 className="flex items-center mb-3 font-semibold text-blue-700 dark:text-blue-300">
                  <Clock className="w-4 h-4 mr-2" />
                  Working Hours
                </h4>
                <div className="flex items-center justify-center p-4 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-blue-600">
                  <span className="text-lg font-bold text-white">
                    {therapist.workingHours
                      ? `${therapist.workingHours.start} - ${therapist.workingHours.end}`
                      : "Not specified"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status and Actions */}
          <Card className="transition-all duration-300 shadow-lg bg-gradient-to-br from-card to-card/80 border-primary/20 hover:shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-500/5 to-emerald-600/10 border-emerald-500/20">
              <CardTitle className="flex items-center text-xl text-emerald-700 dark:text-emerald-300">
                <div className="p-2 mr-3 rounded-full bg-emerald-500/10">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                Status and Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-6 border rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <h4 className="flex items-center mb-4 font-semibold text-primary">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Current Status
                </h4>
                <div className="flex items-center justify-center">
                  <span
                    className={`inline-flex items-center px-6 py-3 rounded-full text-base font-bold shadow-lg transition-all duration-300 ${
                      therapist.status === "approved"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                        : therapist.status === "rejected"
                        ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                        : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                    }`}
                  >
                    {therapist.status === "approved" ? (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    ) : therapist.status === "rejected" ? (
                      <XCircle className="w-5 h-5 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 mr-2" />
                    )}
                    {therapist.status === "approved"
                      ? "APPROVED"
                      : therapist.status === "rejected"
                      ? "REJECTED"
                      : "PENDING APPROVAL"}
                  </span>
                </div>
              </div>
              {therapist.status === "pending" && (
                <div className="p-6 border border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-800">
                  <h4 className="flex items-center mb-4 font-semibold text-orange-700 dark:text-orange-300">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Action Required
                  </h4>
                  <p className="mb-6 text-sm text-orange-600 dark:text-orange-400">
                    This therapist is awaiting approval. Review their
                    information and choose an action below.
                  </p>
                  <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <Button
                      onClick={handleApprove}
                      disabled={loading}
                      className="flex-1 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Approve Therapist
                    </Button>
                    <Button
                      onClick={handleReject}
                      disabled={loading}
                      className="flex-1 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Reject Therapist
                    </Button>
                  </div>
                </div>
              )}

              {(therapist.status === "approved" ||
                therapist.status === "rejected") && (
                <div className="p-6 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 dark:border-gray-700">
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${
                        therapist.status === "approved"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {therapist.status === "approved" ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : (
                        <XCircle className="w-8 h-8" />
                      )}
                    </div>
                    <h4 className="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {therapist.status === "approved"
                        ? "Therapist Approved"
                        : "Therapist Rejected"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {therapist.status === "approved"
                        ? "This therapist has been approved and can now accept appointments."
                        : "This therapist has been rejected and cannot accept appointments."}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TherapistDetails;
