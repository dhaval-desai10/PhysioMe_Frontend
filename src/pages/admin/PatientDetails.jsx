import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../lib/AuthContext";
import { Loader2, ArrowLeft } from "lucide-react";
import { adminApi } from "../../services/api";

function PatientDetails() {
  const { id: patientId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(null);
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

    if (checkAuth() && patientId) {
      fetchPatientDetails();
    } else if (!patientId) {
      setError("Patient ID is missing");
      setLoading(false);
    }
  }, [patientId, navigate]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApi.getPatientDetails(patientId);

      if (response.data?.success) {
        setPatient(response.data.data);
      } else {
        throw new Error("Patient data not found");
      }
    } catch (err) {
      console.error("Error fetching patient details:", err);
      if (err.message === "Authentication required") {
        navigate("/admin/login");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch patient details"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-foreground">Loading patient details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 bg-background">
        <div className="container px-4 mx-auto">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="py-8">
              <div className="text-center">
                <p className="mb-2 font-medium text-destructive">
                  Error Loading Patient
                </p>
                <p className="text-muted-foreground">{error}</p>
                <Button
                  onClick={() => navigate("/admin/dashboard")}
                  variant="outline"
                  className="mt-4"
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

  if (!patient) {
    return (
      <div className="min-h-screen py-8 bg-background">
        <div className="container px-4 mx-auto">
          <Card className="border-border/50 bg-card">
            <CardContent className="py-8">
              <div className="text-center">
                <p className="mb-4 text-muted-foreground">Patient not found</p>
                <Button
                  onClick={() => navigate("/admin/dashboard")}
                  variant="outline"
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="container px-4 py-8 mx-auto relative z-10">
        {/* Header Section */}
        <div className="p-6 mb-8 border bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/admin/dashboard")}
                className="border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
                  Patient Details
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Review and manage patient information
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Personal Information */}
          <Card className="transition-all duration-300 bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-lg hover:shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-blue-500/5 to-blue-600/10 border-blue-500/20">
              <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                <div className="p-2 mr-3 rounded-full bg-blue-500/10">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 overflow-hidden rounded-full shadow-lg border-4 border-primary/30">
                    {patient.profilePictureUrl ? (
                      <img
                        src={patient.profilePictureUrl}
                        alt={patient.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 to-primary/40">
                        <span className="text-3xl font-bold text-primary">
                          {patient.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-card flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {patient.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-muted-foreground">
                      <svg
                        className="w-4 h-4 mr-2 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {patient.email}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <svg
                        className="w-4 h-4 mr-2 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {patient.phone || "No phone number"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card className="transition-all duration-300 bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-lg hover:shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-green-500/5 to-green-600/10 border-green-500/20">
              <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                <div className="p-2 mr-3 rounded-full bg-green-500/10">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Date of Birth
                  </h4>
                  <p className="text-foreground font-medium">
                    {patient.dateOfBirth
                      ? new Date(patient.dateOfBirth).toLocaleDateString()
                      : "Not provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/5 to-blue-600/10 border border-blue-500/20">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      Gender
                    </h4>
                    <p className="text-foreground font-medium">
                      {patient.gender || "Not specified"}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/5 to-purple-600/10 border border-purple-500/20">
                    <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
                      Age
                    </h4>
                    <p className="text-foreground font-medium">
                      {patient.age || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/5 to-orange-600/10 border border-orange-500/20">
                  <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                    Medical History
                  </h4>
                  <p className="text-foreground whitespace-pre-wrap">
                    {patient.medicalHistory || "No medical history provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="transition-all duration-300 bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-lg hover:shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-indigo-500/5 to-indigo-600/10 border-indigo-500/20">
              <CardTitle className="flex items-center text-indigo-700 dark:text-indigo-300">
                <div className="p-2 mr-3 rounded-full bg-indigo-500/10">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/5 to-indigo-600/10 border border-indigo-500/20">
                <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  Address
                </h4>
                <p className="text-foreground">
                  {patient.address || "No address provided"}
                </p>
              </div>

              {patient.emergencyContact && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-red-500/5 to-red-600/10 border border-red-500/20">
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    Emergency Contact
                  </h4>
                  <div className="space-y-2">
                    <p className="text-foreground">
                      <span className="font-medium">Name:</span>{" "}
                      {patient.emergencyContact.name || "Not provided"}
                    </p>
                    <p className="text-foreground">
                      <span className="font-medium">Relationship:</span>{" "}
                      {patient.emergencyContact.relationship || "Not specified"}
                    </p>
                    <p className="text-foreground">
                      <span className="font-medium">Phone:</span>{" "}
                      {patient.emergencyContact.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="transition-all duration-300 bg-gradient-to-br from-card to-card/80 border-primary/20 shadow-lg hover:shadow-xl">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-500/5 to-emerald-600/10 border-emerald-500/20">
              <CardTitle className="flex items-center text-emerald-700 dark:text-emerald-300">
                <div className="p-2 mr-3 rounded-full bg-emerald-500/10">
                  <svg
                    className="w-5 h-5 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/5 to-emerald-600/10 border border-emerald-500/20">
                <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Current Status
                </h4>
                <div className="flex items-center justify-center">
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                      patient.status === "active"
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                    }`}
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {patient.status === "active" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      )}
                    </svg>
                    {(patient.status || "active").toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/5 to-blue-600/10 border border-blue-500/20">
                <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  Registration Date
                </h4>
                <p className="text-foreground font-medium">
                  {patient.createdAt &&
                    new Date(patient.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Patient account is active and ready for appointments
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export { PatientDetails as default };
