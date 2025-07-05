import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  Award,
  Users,
  BookOpen,
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

export default function TherapistProfileView() {
  const { therapistId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTherapistProfile = async () => {
      if (!therapistId) return;

      try {
        setLoading(true);
        const response = await api.get(`/therapist/${therapistId}/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setTherapist(response.data.data);
        } else {
          setError("Therapist not found");
        }
      } catch (error) {
        console.error("Error fetching therapist profile:", error);
        setError("Failed to load therapist profile");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistProfile();
  }, [therapistId]);

  const handleBookAppointment = () => {
    navigate(`/therapist/${therapistId}/book`);
  };

  const formatWorkingHours = (workingHours, workingDays) => {
    if (!workingHours || (!workingHours.start && !workingHours.end)) {
      return "Not specified";
    }

    const timeRange = `${workingHours.start || "09:00"} - ${
      workingHours.end || "17:00"
    }`;

    if (workingDays && Array.isArray(workingDays) && workingDays.length > 0) {
      const daysText = workingDays.join(", ");
      return `${daysText}: ${timeRange}`;
    }

    return `Monday - Friday: ${timeRange}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Profile Not Found
          </h2>
          <p className="text-slate-300 mb-4">
            {error || "This therapist profile could not be loaded."}
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 border-0"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mr-4 text-white hover:bg-white/10 border-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
            Therapist Profile
          </h1>
        </div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-6 overflow-hidden border-0 shadow-xl bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
                    {therapist.profilePictureUrl ? (
                      <img
                        src={therapist.profilePictureUrl}
                        alt={therapist.name}
                        className="w-32 h-32 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-cyan-400">
                        {therapist.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {therapist.name}
                      </h2>
                      <div className="flex items-center mb-2">
                        <Award className="h-4 w-4 text-cyan-400 mr-2" />
                        <span className="text-lg text-slate-300">
                          {therapist.specialization}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-cyan-400 mr-2" />
                        <div className="text-slate-300">
                          {therapist.clinicName && (
                            <div className="font-medium">
                              {therapist.clinicName}
                            </div>
                          )}
                          <div>
                            {therapist.clinicAddress ||
                              therapist.address ||
                              therapist.city ||
                              "Location not specified"}
                          </div>
                        </div>
                      </div>
                      {therapist.rating && therapist.rating > 0 ? (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium text-white">
                            {therapist.rating}
                          </span>
                          <span className="text-slate-400 ml-1">
                            ({therapist.totalRatings || 0} reviews)
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-slate-400">
                          <Star className="h-4 w-4 mr-1" />
                          <span className="text-sm">No ratings yet</span>
                        </div>
                      )}
                    </div>

                    {user?.role === "patient" && (
                      <Button
                        onClick={handleBookAppointment}
                        size="lg"
                        className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BookOpen className="h-5 w-5 mr-2 text-cyan-400" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">
                  {therapist.bio || "No bio available"}
                </p>
                {therapist.experience && therapist.experience > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-white">Experience</p>
                    <p className="text-slate-300">
                      {therapist.experience}{" "}
                      {therapist.experience === 1 ? "year" : "years"} of
                      professional experience
                    </p>
                  </div>
                )}
                {therapist.licenseNumber && (
                  <div className="mt-4">
                    <p className="font-medium text-white">License Number</p>
                    <p className="text-slate-300">{therapist.licenseNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact & Working Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Clock className="h-5 w-5 mr-2 text-cyan-400" />
                  Availability & Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-white mb-2">Working Hours</p>
                  <p className="text-sm text-slate-300">
                    {formatWorkingHours(
                      therapist.workingHours,
                      therapist.workingDays
                    )}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-white mb-2">Contact</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-300">
                      <Mail className="h-4 w-4 mr-2 text-cyan-400" />
                      {therapist.email}
                    </div>
                    {therapist.phone && (
                      <div className="flex items-center text-sm text-slate-300">
                        <Phone className="h-4 w-4 mr-2 text-cyan-400" />
                        {therapist.phone}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Specializations */}
          {therapist.specializations &&
            therapist.specializations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="md:col-span-2"
              >
                <Card className="border-0 shadow-xl bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Users className="h-5 w-5 mr-2 text-cyan-400" />
                      Specializations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specializations.map((spec, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 text-cyan-300 border border-cyan-500/30 hover:from-cyan-600/30 hover:to-purple-600/30"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
        </div>
      </div>
    </div>
  );
}
