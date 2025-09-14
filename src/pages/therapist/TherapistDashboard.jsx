import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
  Edit3,
  FileText,
  UserCheck,
  PlusCircle,
  User,
} from "lucide-react"; // Added new icons
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom"; // Added Link for navigation
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import api from "../../services/api";
import { useAuth } from "../../lib/AuthContext";

export default function TherapistDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    completedSessions: 0,
    pendingReports: 0,
  });

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [therapistName, setTherapistName] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch therapist profile to get the name
        const profileResponse = await api.get(`/therapist/${user._id}/profile`);
        if (profileResponse.data.success) {
          setTherapistName(profileResponse.data.data.name);
        }

        // Fetch dashboard stats
        const statsResponse = await api.get(`/therapist/${user._id}/dashboard`);
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }

        // Fetch upcoming appointments
        const appointmentsResponse = await api.get(
          `/therapist/${user._id}/appointments`
        );
        if (appointmentsResponse.data.success) {
          setUpcomingAppointments(appointmentsResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchTherapists = async () => {
    const response = await api.get("/therapist", {
      params: { status: "approved" },
    });
    // ... handle response
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
              Welcome back, {therapistName}
            </h1>
            <p className="text-slate-300">Here's what's happening today</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
              <User className="h-5 w-5 text-blue-400" />
            </div>

            <Link to="/therapist/appointments" className="w-full">
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                size="sm"
              >
                New Appointment
              </Button>{" "}
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">
                  Total Patients
                </CardTitle>
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.totalPatients}
                </div>
                <p className="text-xs text-blue-300">Active patients</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-200">
                  Today's Appointments
                </CardTitle>
                <div className="p-2 rounded-full bg-green-500/20">
                  <Calendar className="h-4 w-4 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.appointmentsToday}
                </div>
                <p className="text-xs text-green-300">Scheduled today</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">
                  Completed Sessions
                </CardTitle>
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Activity className="h-4 w-4 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.completedSessions}
                </div>
                <p className="text-xs text-purple-300">This month</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 backdrop-blur-sm border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-orange-200">
                  Pending Reports
                </CardTitle>
                <div className="p-2 rounded-full bg-orange-500/20">
                  <AlertCircle className="h-4 w-4 text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.pendingReports}
                </div>
                <p className="text-xs text-orange-300">Need attention</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-0 bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30">
                          <Clock className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {appointment.patientName}
                          </p>
                          <p className="text-sm text-slate-300">
                            {appointment.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-white">
                          {appointment.time}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No upcoming appointments
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border-0 bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/therapist/exercise-plan" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Exercise Plan
                </Button>
              </Link>
              <Link to="/therapist/appointments" className="w-full">
                <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Calendar className="mr-2 h-4 w-4" /> Appointments &
                  Availability
                </Button>
              </Link>
              <Link to="/therapist/patients">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                  <Users className="mr-2 h-5 w-5" /> View Patient Profiles
                </Button>
              </Link>
              <Link to="/therapist/progress-overview">
                <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                  <TrendingUp className="mr-2 h-5 w-5" /> Patient Progress
                </Button>
              </Link>
              <Link to="/therapist/profile">
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
                  <UserCheck className="mr-2 h-5 w-5" /> Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
