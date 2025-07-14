import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  MoreVertical,
  User,
  Calendar,
  Activity,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useAuth } from "../../lib/AuthContext";
import api from "../../services/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch patients for the therapist
  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);

        // Get all appointments for this therapist
        const appointmentsResponse = await api.get("/appointments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (appointmentsResponse.data.success) {
          const appointments = appointmentsResponse.data.data;

          // Extract unique patients from appointments
          const uniquePatients = appointments.reduce((acc, appointment) => {
            const patientId = appointment.patientId._id;
            if (!acc.find((p) => p._id === patientId)) {
              const lastVisit = appointments
                .filter(
                  (appt) =>
                    appt.patientId._id === patientId &&
                    appt.status === "completed"
                )
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

              const nextAppointment = appointments
                .filter(
                  (appt) =>
                    appt.patientId._id === patientId &&
                    (appt.status === "pending" ||
                      appt.status === "confirmed") &&
                    new Date(appt.date) >= new Date()
                )
                .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

              acc.push({
                _id: patientId,
                name: appointment.patientId.name,
                email: appointment.patientId.email,
                age: appointment.patientId.age || "N/A",
                condition: appointment.type || "General",
                lastVisit: lastVisit ? lastVisit.date : "No visits yet",
                nextAppointment: nextAppointment
                  ? nextAppointment.date
                  : "No upcoming appointments",
                totalAppointments: appointments.filter(
                  (appt) => appt.patientId._id === patientId
                ).length,
                completedAppointments: appointments.filter(
                  (appt) =>
                    appt.patientId._id === patientId &&
                    appt.status === "completed"
                ).length,
              });
            }
            return acc;
          }, []);

          setPatients(uniquePatients);
        } else {
          setPatients([]);
        }
      } catch (error) {
        setError("Failed to load patients");
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "physiotherapist") {
      fetchPatients();
    }
  }, [user]);

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (
      dateString === "No visits yet" ||
      dateString === "No upcoming appointments"
    ) {
      return dateString;
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateProgress = (completed, total) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="py-8">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Patients</h1>
            <p className="text-muted-foreground">
              View and manage your patient records
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 text-sm font-medium rounded-full bg-primary/10 text-primary">
              {patients.length} Patients
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search patients by name or condition..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPatients.length === 0 && (
          <div className="py-12 text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No patients found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "You don't have any patients yet"}
            </p>
          </div>
        )}

        {/* Patients List */}
        {!loading && !error && filteredPatients.length > 0 && (
          <div className="space-y-6">
            {filteredPatients.map((patient) => (
              <motion.div
                key={patient._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                          <span className="text-lg font-semibold text-primary">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {patient.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {patient.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Age: {patient.age} • Condition: {patient.condition}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 md:items-end">
                        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-6">
                          <div className="text-center md:text-left">
                            <p className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-1" />
                              Last Visit
                            </p>
                            <p className="text-sm font-medium">
                              {formatDate(patient.lastVisit)}
                            </p>
                          </div>
                          <div className="text-center md:text-left">
                            <p className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4 mr-1" />
                              Next Appointment
                            </p>
                            <p className="text-sm font-medium">
                              {formatDate(patient.nextAppointment)}
                            </p>
                          </div>
                        </div>
                        <div className="w-full md:w-48">
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="flex items-center">
                              <Activity className="w-4 h-4 mr-1" />
                              Progress
                            </span>
                            <span>
                              {calculateProgress(
                                patient.completedAppointments,
                                patient.totalAppointments
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-primary/10">
                            <div
                              className="h-full transition-all duration-300 rounded-full bg-primary"
                              style={{
                                width: `${calculateProgress(
                                  patient.completedAppointments,
                                  patient.totalAppointments
                                )}%`,
                              }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {patient.completedAppointments} of{" "}
                            {patient.totalAppointments} sessions completed
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Link to={`/therapist/patient/${patient._id}`}>
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                        </Link>
                        <Link to={`/therapist/exercise-plan/${patient._id}`}>
                          <Button variant="default" size="sm">
                            Create Plan
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
