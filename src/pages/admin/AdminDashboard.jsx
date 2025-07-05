import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, Users, UserPlus, Calendar } from "lucide-react";
import { adminApi } from "../../services/api";
import {
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../../lib/AuthContext";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTherapists: 0,
    pendingApprovals: 0,
    totalPatients: 0,
    activeAppointments: 0,
  });
  const [patients, setPatients] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("therapists"); // 'therapists' or 'patients'
  const navigate = useNavigate();
  const { logout } = useAuth();

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

    const fetchDashboardData = async () => {
      try {
        if (!checkAuth()) return;

        setLoading(true);
        setError(null);

        // Fetch dashboard stats
        const statsResponse = await adminApi.getDashboardStats();

        // Fetch therapists
        const therapistsResponse = await adminApi.getAllTherapists();
        const therapistsData = therapistsResponse.data.data || [];
        setTherapists(therapistsData);

        // Fetch patients with registration data
        const patientsResponse = await adminApi.getAllPatients();
        let patientsData = [];
        if (patientsResponse.data && patientsResponse.data.data) {
          // Map the patient data to include all registration fields
          const formattedPatients = patientsResponse.data.data.map(
            (patient) => ({
              ...patient,
              name: patient.name || `${patient.firstName} ${patient.lastName}`,
              age: patient.age || calculateAge(patient.dateOfBirth),
              gender: patient.gender || "Not specified",
              medicalHistory:
                patient.medicalHistory || "No medical history provided",
            })
          );
          setPatients(formattedPatients);
          patientsData = formattedPatients;
        } else {
          console.log("No patients data found");
          setPatients([]);
        }

        // Calculate updated stats based on actual data
        const calculatedStats = {
          totalTherapists: therapistsData.length,
          pendingApprovals: therapistsData.filter((t) => t.status === "pending")
            .length,
          totalPatients: patientsData.length,
          activeAppointments: statsResponse.data?.activeAppointments || 0, // Keep from API as we don't fetch appointments here
        };

        // Use calculated stats instead of API stats for better accuracy
        setStats(calculatedStats);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Filter therapists based on search term
  const filteredTherapists = therapists.filter(
    (therapist) =>
      therapist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specialization
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      therapist.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medicalHistory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-background to-primary/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <FaSpinner className="text-6xl animate-spin text-primary" />
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
              </div>
              <span className="text-xl font-medium text-foreground">
                Loading dashboard data...
              </span>
              <div className="w-32 h-2 overflow-hidden rounded-full bg-primary/20">
                <div className="h-full bg-gradient-to-r from-primary to-primary/70 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-background to-destructive/5">
        <div className="mx-auto max-w-7xl">
          <div className="p-6 mb-6 border-l-4 shadow-lg rounded-2xl bg-destructive/10 border-destructive">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-full bg-destructive/20">
                <svg
                  className="w-6 h-6 text-destructive"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="mb-1 text-lg font-medium text-destructive">
                  Error Loading Dashboard
                </h3>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          </div>
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
        ></div>
      </div>
      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* Header Section with improved styling */}
        <div className="p-6 mb-8 border bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Manage therapists, patients, and appointments
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="text-white transition-all duration-300 bg-red-600 shadow-lg hover:bg-red-700 hover:shadow-xl"
              size="lg"
            >
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/30 hover:shadow-2xl hover:scale-105 group">
            <div className="absolute top-0 right-0 w-20 h-20 transition-all duration-300 rounded-bl-full bg-blue-500/10 group-hover:w-24 group-hover:h-24"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-300 transition-colors group-hover:text-blue-200">
                Total Therapists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="p-3 mr-4 transition-colors duration-300 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30">
                  <FaUserMd className="text-xl text-blue-400 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-blue-100 transition-colors duration-300 group-hover:text-blue-50">
                    {stats.totalTherapists}
                  </span>
                  <span className="mt-1 text-xs text-blue-300/80">
                    {stats.totalTherapists === 1 ? "Therapist" : "Therapists"}{" "}
                    registered
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden transition-all duration-300 cursor-pointer bg-gradient-to-br from-yellow-500/10 to-yellow-600/20 border-yellow-500/30 hover:shadow-2xl hover:scale-105 group">
            <div className="absolute top-0 right-0 w-20 h-20 transition-all duration-300 rounded-bl-full bg-yellow-500/10 group-hover:w-24 group-hover:h-24"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-300 transition-colors group-hover:text-yellow-200">
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="p-3 mr-4 transition-colors duration-300 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/30">
                  <UserPlus className="text-xl text-yellow-400 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-yellow-100 transition-colors duration-300 group-hover:text-yellow-50">
                    {stats.pendingApprovals}
                  </span>
                  <span className="mt-1 text-xs text-yellow-300/80">
                    {stats.pendingApprovals === 1
                      ? "Application"
                      : "Applications"}{" "}
                    pending
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden transition-all duration-300 cursor-pointer bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/30 hover:shadow-2xl hover:scale-105 group">
            <div className="absolute top-0 right-0 w-20 h-20 transition-all duration-300 rounded-bl-full bg-green-500/10 group-hover:w-24 group-hover:h-24"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-300 transition-colors group-hover:text-green-200">
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="p-3 mr-4 transition-colors duration-300 rounded-full bg-green-500/20 group-hover:bg-green-500/30">
                  <FaUserInjured className="text-xl text-green-400 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-green-100 transition-colors duration-300 group-hover:text-green-50">
                    {stats.totalPatients}
                  </span>
                  <span className="mt-1 text-xs text-green-300/80">
                    {stats.totalPatients === 1 ? "Patient" : "Patients"}{" "}
                    registered
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden transition-all duration-300 cursor-pointer bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/30 hover:shadow-2xl hover:scale-105 group">
            <div className="absolute top-0 right-0 w-20 h-20 transition-all duration-300 rounded-bl-full bg-purple-500/10 group-hover:w-24 group-hover:h-24"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-300 transition-colors group-hover:text-purple-200">
                Active Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="p-3 mr-4 transition-colors duration-300 rounded-full bg-purple-500/20 group-hover:bg-purple-500/30">
                  <FaCalendarCheck className="text-xl text-purple-400 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-purple-100 transition-colors duration-300 group-hover:text-purple-50">
                    {stats.activeAppointments}
                  </span>
                  <span className="mt-1 text-xs text-purple-300/80">
                    {stats.activeAppointments === 1
                      ? "Appointment"
                      : "Appointments"}{" "}
                    active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Therapist/Patient List Section */}
        <div className="p-8 mb-8 transition-all duration-300 border shadow-xl rounded-2xl bg-gradient-to-br from-card to-card/80 border-primary/20 backdrop-blur-sm hover:shadow-2xl">
          <div className="flex flex-col items-start justify-between mb-8 space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div className="flex space-x-3">
              <Button
                variant={activeTab === "therapists" ? "default" : "outline"}
                onClick={() => setActiveTab("therapists")}
                className={
                  activeTab === "therapists"
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                    : "border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                }
                size="lg"
              >
                <FaUserMd className="mr-2" />
                Therapists
              </Button>
              <Button
                variant={activeTab === "patients" ? "default" : "outline"}
                onClick={() => setActiveTab("patients")}
                className={
                  activeTab === "patients"
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                    : "border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                }
                size="lg"
              >
                <FaUserInjured className="mr-2" />
                Patients
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/approvals")}
                className="text-yellow-400 transition-all duration-300 border-2 border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-500/50"
                size="lg"
              >
                <UserPlus className="mr-2" />
                Approvals
              </Button>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute w-5 h-5 left-4 top-4 text-primary/60" />
              <Input
                type="search"
                placeholder="Search..."
                className="py-3 pl-12 pr-4 text-lg transition-all duration-300 border-2 border-primary/30 bg-background/50 text-foreground rounded-xl focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Enhanced Therapist List */}
          {activeTab === "therapists" && (
            <div className="space-y-6">
              {filteredTherapists.length > 0 ? (
                filteredTherapists.map((therapist) => (
                  <Card
                    key={therapist._id}
                    className="group overflow-hidden transition-all duration-300 bg-gradient-to-r from-card to-card/50 border-2 border-primary/20 hover:border-primary/40 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1"
                  >
                    <CardContent className="p-0">
                      <div className="p-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="relative">
                              <Avatar className="w-16 h-16 border-4 shadow-lg border-primary/30">
                                <AvatarImage
                                  src={therapist.profilePicture}
                                  alt={therapist.name}
                                />
                                <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/20 to-primary/40 text-primary">
                                  {therapist.name?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute w-6 h-6 bg-green-500 border-2 rounded-full -bottom-1 -right-1 border-card"></div>
                            </div>
                            <div>
                              <h3 className="mb-1 text-2xl font-bold text-foreground">
                                {therapist.name}
                              </h3>
                              <p className="text-lg font-medium text-primary/80">
                                {therapist.specialization}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {therapist.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge
                              variant={
                                therapist.status === "approved"
                                  ? "default"
                                  : therapist.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={`px-4 py-2 text-sm font-semibold ${
                                therapist.status === "approved"
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : therapist.status === "rejected"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              }`}
                            >
                              {therapist.status?.charAt(0).toUpperCase() +
                                therapist.status?.slice(1)}
                            </Badge>
                            <Button
                              variant="default"
                              size="lg"
                              onClick={() =>
                                navigate(`/admin/therapists/${therapist._id}`)
                              }
                              className="relative px-6 py-3 overflow-hidden text-white transition-all duration-300 transform border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-2xl group-hover:scale-110 hover:scale-105"
                            >
                              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/20 to-transparent hover:opacity-100"></div>
                              <div className="relative flex items-center">
                                <svg
                                  className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                <span className="font-semibold">
                                  View Details
                                </span>
                                <svg
                                  className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="py-20 text-center border-2 border-dashed bg-gradient-to-br from-card/50 to-primary/5 rounded-2xl border-primary/20">
                  <div className="p-6 mx-auto mb-6 rounded-full bg-primary/5 w-fit">
                    <FaUserMd className="text-6xl text-primary/60" />
                  </div>
                  <h3 className="mb-2 text-2xl font-semibold text-foreground">
                    No therapists found
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Start by approving some therapist applications
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Patient List */}
          {activeTab === "patients" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text">
                  Registered Patients
                </h2>
                <div className="relative">
                  <Search className="absolute transform -translate-y-1/2 left-4 top-1/2 text-primary/60" />
                  <Input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="py-3 pl-12 pr-4 text-lg transition-all duration-300 border-2 w-80 border-primary/30 bg-background/50 text-foreground rounded-xl focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="grid gap-6">
                {filteredPatients.map((patient) => (
                  <Card
                    key={patient._id}
                    className="group overflow-hidden transition-all duration-300 bg-gradient-to-r from-card to-card/50 border-2 border-primary/20 hover:border-primary/40 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <Avatar className="w-16 h-16 border-4 shadow-lg border-primary/30">
                              <AvatarImage
                                src={patient.profilePicture}
                                alt={patient.name}
                              />
                              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/20 to-primary/40 text-primary">
                                {patient.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute w-6 h-6 bg-blue-500 border-2 rounded-full -bottom-1 -right-1 border-card"></div>
                          </div>
                          <div>
                            <h3 className="mb-1 text-2xl font-bold text-foreground">
                              {patient.name}
                            </h3>
                            <p className="mb-2 text-lg text-muted-foreground">
                              {patient.email}
                            </p>
                            <div className="flex items-center mt-2 space-x-3">
                              <Badge
                                variant="outline"
                                className="px-3 py-1 text-blue-400 bg-blue-500/10 border-blue-500/30"
                              >
                                {patient.gender}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="px-3 py-1 text-green-400 bg-green-500/10 border-green-500/30"
                              >
                                {patient.age} years
                              </Badge>
                              {patient.medicalHistory && (
                                <Badge
                                  variant="outline"
                                  className="max-w-[250px] truncate bg-orange-500/10 border-orange-500/30 text-orange-400 px-3 py-1"
                                >
                                  {patient.medicalHistory}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          size="lg"
                          onClick={() =>
                            navigate(`/admin/patients/${patient._id}`)
                          }
                          className="relative px-6 py-3 overflow-hidden text-white transition-all duration-300 transform border-0 shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-2xl group-hover:scale-110 hover:scale-105"
                        >
                          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/20 to-transparent hover:opacity-100"></div>
                          <div className="relative flex items-center">
                            <svg
                              className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span className="font-semibold">View Details</span>
                            <svg
                              className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredPatients.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed bg-gradient-to-br from-card/50 to-primary/5 rounded-2xl border-primary/20">
                    <div className="p-6 mx-auto mb-6 rounded-full bg-primary/5 w-fit">
                      <FaUserInjured className="text-6xl text-primary/60" />
                    </div>
                    <h3 className="mb-2 text-2xl font-semibold text-foreground">
                      No patients found
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      No patients found matching your search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Management Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => navigate("/admin/therapists")}
            className="relative p-8 overflow-hidden text-left transition-all duration-500 border-2 shadow-xl group rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/30 hover:border-blue-400/60 hover:shadow-2xl hover:scale-105"
          >
            <div className="absolute top-0 right-0 w-24 h-24 transition-all duration-300 rounded-bl-full bg-blue-500/10 group-hover:bg-blue-500/20"></div>
            <div className="relative z-10">
              <div className="p-4 mb-4 rounded-full bg-blue-500/20 w-fit">
                <FaUserMd className="text-3xl text-blue-400" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-blue-100 transition-colors group-hover:text-blue-50">
                Manage Therapists
              </h3>
              <p className="text-lg leading-relaxed text-blue-300/80">
                View and manage all registered therapists
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/patients")}
            className="relative p-8 overflow-hidden text-left transition-all duration-500 border-2 shadow-xl group rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/30 hover:border-green-400/60 hover:shadow-2xl hover:scale-105"
          >
            <div className="absolute top-0 right-0 w-24 h-24 transition-all duration-300 rounded-bl-full bg-green-500/10 group-hover:bg-green-500/20"></div>
            <div className="relative z-10">
              <div className="p-4 mb-4 rounded-full bg-green-500/20 w-fit">
                <FaUserInjured className="text-3xl text-green-400" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-green-100 transition-colors group-hover:text-green-50">
                Manage Patients
              </h3>
              <p className="text-lg leading-relaxed text-green-300/80">
                View and manage all registered patients
              </p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/appointments")}
            className="relative p-8 overflow-hidden text-left transition-all duration-500 border-2 shadow-xl group rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-500/30 hover:border-purple-400/60 hover:shadow-2xl hover:scale-105"
          >
            <div className="absolute top-0 right-0 w-24 h-24 transition-all duration-300 rounded-bl-full bg-purple-500/10 group-hover:bg-purple-500/20"></div>
            <div className="relative z-10">
              <div className="p-4 mb-4 rounded-full bg-purple-500/20 w-fit">
                <FaCalendarCheck className="text-3xl text-purple-400" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-purple-100 transition-colors group-hover:text-purple-50">
                View Appointments
              </h3>
              <p className="text-lg leading-relaxed text-purple-300/80">
                Monitor and manage all appointments
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
