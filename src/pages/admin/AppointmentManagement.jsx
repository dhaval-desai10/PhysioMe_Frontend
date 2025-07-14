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
import { Search, ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { adminApi } from "../../services/api";
import { FaCalendarCheck } from "react-icons/fa";
import { useAuth } from "../../lib/AuthContext";
import { Badge } from "../../components/ui/badge";
import { toast } from "react-hot-toast";

const AppointmentManagement = () => {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Mock appointments data - replace with actual API call
      const mockAppointments = [
        {
          _id: "1",
          patientName: "John Doe",
          therapistName: "Dr. Smith",
          date: "2025-01-15",
          time: "10:00 AM",
          status: "scheduled",
          type: "Initial Consultation",
        },
        {
          _id: "2",
          patientName: "Jane Smith",
          therapistName: "Dr. Johnson",
          date: "2025-01-16",
          time: "2:00 PM",
          status: "completed",
          type: "Follow-up",
        },
        {
          _id: "3",
          patientName: "Mike Wilson",
          therapistName: "Dr. Brown",
          date: "2025-01-17",
          time: "11:30 AM",
          status: "cancelled",
          type: "Treatment Session",
        },
      ];
      setAppointments(mockAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.therapistName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-600/20 text-blue-400 border-blue-600";
      case "completed":
        return "bg-green-600/20 text-green-400 border-green-600";
      case "cancelled":
        return "bg-red-600/20 text-red-400 border-red-600";
      default:
        return "bg-gray-600/20 text-gray-400 border-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading appointments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-white">
              Appointment Management
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute w-5 h-5 left-3 top-3 text-gray-400" />
              <Input
                type="search"
                placeholder="Search appointments..."
                className="pl-10 w-80 bg-gray-800 border-gray-600 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <Card className="mb-6 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-purple-400">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {appointments.length}
                </p>
                <p className="text-gray-400">Total Appointments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {appointments.filter((a) => a.status === "scheduled").length}
                </p>
                <p className="text-gray-400">Scheduled</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {appointments.filter((a) => a.status === "completed").length}
                </p>
                <p className="text-gray-400">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">
                  {appointments.filter((a) => a.status === "cancelled").length}
                </p>
                <p className="text-gray-400">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <Card
                key={appointment._id}
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                        <FaCalendarCheck className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {appointment.type}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Patient: {appointment.patientName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Therapist: {appointment.therapistName}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(appointment.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant="outline"
                        className={getStatusColor(appointment.status)}
                      >
                        {appointment.status?.charAt(0).toUpperCase() +
                          appointment.status?.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <FaCalendarCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No appointments found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "No appointments match your search criteria."
                    : "No appointments scheduled yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
