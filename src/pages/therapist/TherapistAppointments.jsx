import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  CalendarDays,
  User,
  MapPin,
  Video,
  Home,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { toast } from "react-hot-toast";
import { useAuth } from "../../lib/AuthContext";
import api from "../../services/api";

export default function TherapistAppointments() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("appointments");
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  // Working hours management state
  const [workingHours, setWorkingHours] = useState({
    start: "09:00",
    end: "17:00",
  });
  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [workingDays, setWorkingDays] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadAppointments(), loadTherapistSettings()]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await api.get(`/therapist/${user._id}/appointments`);
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  };

  const loadTherapistSettings = async () => {
    try {
      const response = await api.get(`/therapist/${user._id}/profile`);
      if (response.data.success) {
        const therapist = response.data.data;
        setWorkingHours(
          therapist.workingHours || { start: "09:00", end: "17:00" }
        );
        setAppointmentDuration(therapist.appointmentDuration || 30);
        setWorkingDays(
          therapist.workingDays || [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ]
        );
      }
    } catch (error) {
      console.error("Error loading therapist settings:", error);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      setUpdatingSettings(true);

      const updateData = {
        workingHours,
        appointmentDuration,
        workingDays,
      };

      const response = await api.put(
        `/therapist/${user._id}/profile`,
        updateData
      );

      if (response.data.success) {
        toast.success("Working hours updated successfully!");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setUpdatingSettings(false);
    }
  };

  const toggleWorkingDay = (day) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAppointmentStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await api.put(
        `/therapist/appointments/${appointmentId}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        toast.success(`Appointment ${newStatus} successfully`);
        loadAppointments();
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getVisitTypeIcon = (visitType) => {
    switch (visitType) {
      case "clinic":
        return <MapPin className="w-4 h-4" />;
      case "home":
        return <Home className="w-4 h-4" />;
      case "online":
        return <Video className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getVisitTypeLabel = (visitType) => {
    switch (visitType) {
      case "clinic":
        return "Clinic Visit";
      case "home":
        return "Home Visit";
      case "online":
        return "Online Consultation";
      default:
        return "Clinic Visit";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-4xl font-bold text-primary">
          Appointments & Availability
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your appointment schedule and availability
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex p-1 mb-8 space-x-1 rounded-lg bg-muted w-fit">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-6 py-2 rounded-md transition-all ${
            activeTab === "appointments"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CalendarDays className="inline-block w-4 h-4 mr-2" />
          Appointments
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-6 py-2 rounded-md transition-all ${
            activeTab === "settings"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="inline-block w-4 h-4 mr-2" />
          Working Hours
        </button>
      </div>

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Your Appointments
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadAppointments}
                  className="flex items-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="py-12 text-center">
                  <CalendarDays className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No appointments found
                  </h3>
                  <p className="text-muted-foreground">
                    Booked appointments from patients will appear here
                    automatically.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Make sure your working hours are set up in the "Working
                    Hours" tab so patients can book slots.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment._id}
                      className="p-6 transition-shadow border rounded-lg hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {appointment.patientName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                {getVisitTypeIcon(appointment.visitType)}
                                <span className="ml-1">
                                  {getVisitTypeLabel(appointment.visitType)}
                                </span>
                              </span>
                              <span>•</span>
                              <span>{appointment.type} appointment</span>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(appointment.date)}
                              <Clock className="w-4 h-4 ml-4 mr-1" />
                              {appointment.time}
                            </div>
                            {appointment.notes && (
                              <p className="p-2 mt-2 text-sm rounded text-muted-foreground bg-muted">
                                <strong>Notes:</strong> {appointment.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                          {appointment.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleAppointmentStatusUpdate(
                                    appointment._id,
                                    "confirmed"
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  handleAppointmentStatusUpdate(
                                    appointment._id,
                                    "cancelled"
                                  )
                                }
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          )}
                          {appointment.status === "confirmed" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAppointmentStatusUpdate(
                                  appointment._id,
                                  "completed"
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Working Hours Settings Tab */}
      {activeTab === "settings" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Working Hours & Schedule Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Working Hours */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    type="time"
                    id="startTime"
                    value={workingHours.start}
                    onChange={(e) =>
                      setWorkingHours((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    type="time"
                    id="endTime"
                    value={workingHours.end}
                    onChange={(e) =>
                      setWorkingHours((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Appointment Duration */}
              <div>
                <Label htmlFor="duration">Appointment Duration (minutes)</Label>
                <Select
                  value={appointmentDuration.toString()}
                  onValueChange={(value) =>
                    setAppointmentDuration(parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Working Days */}
              <div>
                <Label>Working Days</Label>
                <div className="grid grid-cols-2 gap-3 mt-2 md:grid-cols-4">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={workingDays.includes(day)}
                        onCheckedChange={() => toggleWorkingDay(day)}
                      />
                      <Label htmlFor={day} className="text-sm font-medium">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg bg-muted">
                <h3 className="mb-2 font-semibold">Schedule Preview</h3>
                <p className="text-sm text-muted-foreground">
                  Working Hours: {workingHours.start} - {workingHours.end}
                </p>
                <p className="text-sm text-muted-foreground">
                  Appointment Duration: {appointmentDuration} minutes
                </p>
                <p className="text-sm text-muted-foreground">
                  Working Days: {workingDays.join(", ")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Available slots will be automatically generated based on these
                  settings.
                </p>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleUpdateSettings}
                disabled={updatingSettings}
                className="w-full"
              >
                {updatingSettings ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                    Updating Settings...
                  </>
                ) : (
                  "Save Working Hours"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
