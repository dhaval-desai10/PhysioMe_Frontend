import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  Clock,
  FileText,
  MapPin,
  Award,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import api from "../../services/api";
import { useAuth } from "../../lib/AuthContext";

export default function PatientProfileView() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!patientId) return;

      try {
        setLoading(true);

        // Fetch patient profile directly
        const patientResponse = await api.get(
          `/patients/${patientId}/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (patientResponse.data.success) {
          setPatient(patientResponse.data.data);
        } else {
          setError("Patient profile not found");
        }

        // Fetch patient appointments
        const appointmentsResponse = await api.get("/appointments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (appointmentsResponse.data.success) {
          const allAppointments = appointmentsResponse.data.data;
          const patientAppointments = allAppointments.filter(
            (apt) => apt.patientId._id === patientId
          );
          setAppointments(patientAppointments);
        }

        // Fetch treatment plans for this patient
        try {
          const treatmentResponse = await api.get(
            `/treatment-plans/patient/${patientId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (treatmentResponse.data.success) {
            setTreatmentPlans(treatmentResponse.data.data);
          }
        } catch (treatmentError) {
          setTreatmentPlans([]);
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Failed to load patient information");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "physiotherapist") {
      fetchPatientData();
    }
  }, [patientId, user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const calculateProgress = () => {
    const completed = appointments.filter(
      (apt) => apt.status === "completed"
    ).length;
    const total = appointments.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Patient Not Found
          </h2>
          <p className="mb-4 text-gray-600">
            {error || "This patient profile could not be loaded."}
          </p>
          <Button onClick={() => navigate("/therapist/patients")}>
            Back to Patients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-slate-900">
      <div className="container max-w-6xl px-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/therapist/patients")}
              className="mr-4 border text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
            <h1 className="text-2xl font-bold text-white">Patient Profile</h1>
          </div>
          <div className="flex items-center space-x-2">
            
            {/* pinding of this progress report */}
            
            {/* <Link to={`/therapist/progress/${patientId}`}>
              <Button className="font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl">
                <Activity className="w-4 h-4 mr-2" />
                View Progress
              </Button>
            </Link> */}
          </div>
        </div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-6 shadow-xl bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
            <CardContent className="p-8">
              <div className="flex flex-col gap-8 md:flex-row">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-32 h-32 border-2 rounded-full bg-primary/20 border-primary/30">
                    {patient.profilePictureUrl ? (
                      <img
                        src={patient.profilePictureUrl}
                        alt={patient.name}
                        className="object-cover w-32 h-32 rounded-full"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-primary">
                        {patient.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex flex-col mb-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="mb-2 text-3xl font-bold text-white">
                        {patient.name}
                      </h2>
                      <div className="space-y-2">
                        <div className="flex items-center text-slate-300">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{patient.email}</span>
                        </div>
                        {patient.phone && (
                          <div className="flex items-center text-slate-300">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>{patient.phone}</span>
                          </div>
                        )}
                        {patient.age && (
                          <div className="flex items-center text-slate-300">
                            <User className="w-4 h-4 mr-2" />
                            <span>Age: {patient.age}</span>
                          </div>
                        )}
                        {patient.address && (
                          <div className="flex items-center text-slate-300">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{patient.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0">
                      <div className="p-4 border rounded-lg bg-primary/20 border-primary/30 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-primary">
                          {calculateProgress()}%
                        </div>
                        <div className="text-sm text-slate-300">
                          Treatment Progress
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Appointment History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="shadow-xl bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Calendar className="w-5 h-5 mr-2" />
                  Appointment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 overflow-y-auto max-h-96">
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="flex items-center justify-between p-3 border rounded-lg border-slate-600/50 bg-slate-700/30"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {formatDate(appointment.date)}
                          </p>
                          <p className="text-sm text-slate-300">
                            {appointment.time} • {appointment.type}
                          </p>
                          {appointment.visitType && (
                            <p className="text-xs capitalize text-slate-400">
                              {appointment.visitType} visit
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-slate-400">
                      No appointments found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Treatment Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-xl bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <FileText className="w-5 h-5 mr-2" />
                  Treatment Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 overflow-y-auto max-h-96">
                  {treatmentPlans.length > 0 ? (
                    treatmentPlans.map((plan) => (
                      <div
                        key={plan._id}
                        className="p-3 transition-colors border rounded-lg border-slate-600/50 bg-slate-700/30 hover:border-primary/50"
                      >
                        <h4 className="font-medium text-white">{plan.title}</h4>
                        <p className="mt-1 text-sm text-slate-300">
                          {plan.description}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-slate-400">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Duration: {plan.duration}</span>
                        </div>
                        {plan.exercises && (
                          <div className="mt-2">
                            <p className="text-xs text-slate-400">
                              {plan.exercises.length} exercises assigned
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-center text-slate-400">
                      No treatment plans assigned
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl bg-slate-800/60 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Activity className="w-5 h-5 mr-2" />
                  Patient Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="p-4 text-center border rounded-lg bg-blue-600/20 border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400">
                      {appointments.length}
                    </div>
                    <div className="text-sm text-slate-300">
                      Total Appointments
                    </div>
                  </div>
                  <div className="p-4 text-center border rounded-lg bg-green-600/20 border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">
                      {
                        appointments.filter((apt) => apt.status === "completed")
                          .length
                      }
                    </div>
                    <div className="text-sm text-slate-300">Completed</div>
                  </div>
                  <div className="p-4 text-center border rounded-lg bg-yellow-600/20 border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-400">
                      {
                        appointments.filter(
                          (apt) =>
                            apt.status === "pending" ||
                            apt.status === "confirmed"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-slate-300">Upcoming</div>
                  </div>
                  <div className="p-4 text-center border rounded-lg bg-purple-600/20 border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-400">
                      {treatmentPlans.length}
                    </div>
                    <div className="text-sm text-slate-300">
                      Treatment Plans
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
