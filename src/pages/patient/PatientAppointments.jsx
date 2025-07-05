import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { toast } from "react-hot-toast";
import {
  CalendarDays,
  Clock,
  User,
  MapPin,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Hourglass,
  ArrowLeft,
  Video,
  Home,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import api from "../../services/api";

export default function PatientAppointments() {
  const { user } = useAuth();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  // Show success message if redirected from booking
  useEffect(() => {
    if (location.state?.showNewAppointment) {
      const appointmentData = location.state.appointmentData;
      toast.success(
        `✅ Your appointment with ${appointmentData?.therapistName} has been successfully booked for ${appointmentData?.date} at ${appointmentData?.time}!`,
        { duration: 5000 }
      );
      // Clear the state to prevent showing the message again
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get("/patient/appointments");
     
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const response = await api.put(
        `/patient/appointments/${appointmentId}/cancel`
      );

      if (response.data.success) {
        toast.success("Appointment cancelled successfully");
        fetchAppointments(); // Refresh the list
      } else {
        toast.error("Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return (
          <Badge variant="default" className="text-white bg-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="text-white bg-yellow-500">
            <Hourglass className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getVisitTypeIcon = (visitType) => {
    switch (visitType) {
      case "home":
        return <Home className="w-4 h-4" />;
      case "online":
        return <Video className="w-4 h-4" />;
      case "clinic":
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getVisitTypeLabel = (visitType) => {
    switch (visitType) {
      case "home":
        return "Home Visit";
      case "online":
        return "Online Consultation";
      case "clinic":
      default:
        return "Clinic Visit";
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

  const isUpcoming = (appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      appointmentDate >= today &&
      appointment.status !== "cancelled" &&
      appointment.status !== "completed"
    );
  };

  const isPast = (appointment) => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate < today || appointment.status === "completed";
  };

  const isCancelled = (appointment) => {
    return appointment.status === "cancelled";
  };

  const upcomingAppointments = appointments.filter(isUpcoming);
  const pastAppointments = appointments.filter(isPast);
  const cancelledAppointments = appointments.filter(isCancelled);

  const getFilteredAppointments = (filter) => {
    switch (filter) {
      case "upcoming":
        return upcomingAppointments;
      case "past":
        return pastAppointments;
      case "cancelled":
        return cancelledAppointments;
      default:
        return appointments;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="text-muted-foreground">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/patient/dashboard" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">My Appointments</h1>
          </div>
          <Button
            variant="outline"
            onClick={fetchAppointments}
            disabled={loading}
            className="flex items-center"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({cancelledAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
          </TabsList>

          {["upcoming", "past", "cancelled", "all"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="mt-6">
              {getFilteredAppointments(tabValue).length === 0 ? (
                <div className="py-12 text-center">
                  <CalendarDays className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No appointments found
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    {tabValue === "upcoming" &&
                      "You don't have any upcoming appointments."}
                    {tabValue === "past" &&
                      "You don't have any past appointments."}
                    {tabValue === "cancelled" &&
                      "You don't have any cancelled appointments."}
                    {tabValue === "all" &&
                      "You haven't booked any appointments yet."}
                  </p>
                  {tabValue === "all" && (
                    <Link to="/patient/dashboard">
                      <Button>Browse Therapists</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {getFilteredAppointments(tabValue).map((appointment) => (
                    <Card key={appointment._id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">
                            {appointment.physiotherapistId?.name || "Therapist"}
                          </CardTitle>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <CardDescription>
                          {appointment.physiotherapistId?.specialization ||
                            "Physiotherapy"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center">
                            <CalendarDays className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center">
                            {getVisitTypeIcon(appointment.visitType)}
                            <span className="ml-2">
                              {getVisitTypeLabel(appointment.visitType)}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <User className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                            <span>Type: {appointment.type}</span>
                          </div>
                          {appointment.physiotherapistId?.clinicName && (
                            <div className="flex items-start">
                              <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-0.5" />
                              <span>
                                {appointment.physiotherapistId.clinicName}
                              </span>
                            </div>
                          )}
                          {appointment.notes && (
                            <div className="p-2 mt-2 text-xs rounded bg-muted">
                              <strong>Notes:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>

                        {appointment.status === "pending" &&
                          isUpcoming(appointment) && (
                            <div className="pt-4 mt-4 border-t">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  cancelAppointment(appointment._id)
                                }
                                className="w-full"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Appointment
                              </Button>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
