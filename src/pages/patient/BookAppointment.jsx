import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
import { Textarea } from "../../components/ui/textarea";
import { useAuth } from "../../lib/AuthContext";
import { patientApi } from "../../services/api";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  CalendarDays,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function BookAppointment() {
  const { therapistId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [visitType, setVisitType] = useState(""); // Changed from appointmentType to visitType
  const [appointmentType, setAppointmentType] = useState("initial");
  const [notes, setNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === "patient" && therapistId) {
      loadTherapistDetails();
    }
  }, [isAuthenticated, user, therapistId]);

  useEffect(() => {
    if (selectedDate && visitType) {
      // Only load slots when both date and visitType are selected
      loadAvailableSlots();
    } else {
      setAvailableSlots([]);
      setSelectedTime("");
    }
  }, [selectedDate, visitType]);

  const loadTherapistDetails = async () => {
    try {
      setLoading(true);
      // Get therapist from approved therapists list
      const response = await patientApi.getApprovedTherapists();
      const therapistData = response.data.data.find(
        (t) => t._id === therapistId
      );

      if (therapistData) {
        setTherapist(therapistData);
      } else {
        toast.error("Therapist not found");
        navigate("/patient/dashboard");
      }
    } catch (error) {
      console.error("Error loading therapist details:", error);
      toast.error("Failed to load therapist details");
      navigate("/patient/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const response = await patientApi.getAvailableSlots(
        therapistId,
        selectedDate
      );
      setAvailableSlots(response.data.data.availableSlots || []);
    } catch (error) {
      console.error("Error loading available slots:", error);
      toast.error("Failed to load available time slots");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleVisitTypeChange = (type) => {
    setVisitType(type);
    setSelectedTime(""); // Reset time when visit type changes
  };

  const handleBooking = async () => {
    if (!visitType || !selectedDate || !selectedTime) {
      toast.error("Please select visit type, date and time");
      return;
    }

    try {
      setBooking(true);

      // Debug user authentication
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      const appointmentData = {
        physiotherapistId: therapistId,
        date: selectedDate,
        time: selectedTime,
        visitType: visitType, // Include visit type
        type: appointmentType,
        notes: notes.trim() || undefined,
      };

      try {
        const response = await patientApi.createAppointment(
          appointmentData
        );

        // If we get here, the appointment was successfully created
        if (response.data.success) {
          // Set success state immediately
          setBookingSuccess(true);

          // Show success message
          toast.success(
            "🎉 Appointment booked successfully! Redirecting to your appointments...",
            {
              duration: 3000,
            }
          );

          // Redirect after showing success
          setTimeout(() => {
            navigate("/patient/appointments", {
              state: {
                showNewAppointment: true,
                appointmentData: {
                  therapistName: therapist?.name,
                  date: selectedDate,
                  time: selectedTime,
                  visitType: visitType,
                },
              },
            });
          }, 2000);

          return; // Exit successfully
        } else {
          // Response was received but success was false
          throw new Error(response.data.message || "Booking failed");
        }
      } catch (apiError) {
        console.error("API Error details:", apiError);
        console.error("Response status:", apiError.response?.status);
        console.error("Response data:", apiError.response?.data);

        // Handle authentication/authorization errors
        if (apiError.response?.status === 401) {
          toast.error(
            "Authentication required. Please log in again."
          );
          navigate("/login");
          return;
        }

        if (apiError.response?.status === 403) {
          toast.error(
            "Access denied. Please ensure you're logged in as a patient."
          );
          console.error("403 Forbidden - User role or auth issue");
          return;
        }

        // Check if it's a genuine validation error that should be shown
        if (
          apiError.response?.status === 400 &&
          apiError.response?.data?.message
        ) {
          const errorMessage = apiError.response.data.message;

          // Check for specific validation errors that should prevent success
          if (
            errorMessage.includes("already booked") ||
            errorMessage.includes("not found") ||
            errorMessage.includes("required") ||
            errorMessage.includes("Invalid") ||
            errorMessage.includes("Not authorized")
          ) {
            toast.error(errorMessage);
            return; // Don't try to check for success
          }
        }

        // For other errors, check if appointment might have been created

        // Small delay then check if appointment exists
        setTimeout(async () => {
          try {
            const appointmentsResponse =
              await patientApi.getMyAppointments();
            const recentAppointments =
              appointmentsResponse.data.data || [];

            // Look for an appointment created in the last minute that matches our booking
            const now = new Date();
            const oneMinuteAgo = new Date(now.getTime() - 60000);

            const matchingAppointment = recentAppointments.find(
              (apt) => {
                const appointmentCreated = new Date(apt.createdAt);
                return (
                  apt.physiotherapistId._id === therapistId &&
                  apt.date === selectedDate &&
                  apt.time === selectedTime &&
                  appointmentCreated >= oneMinuteAgo
                );
              }
            );

            if (matchingAppointment) {
              setBookingSuccess(true);
              toast.success(
                "🎉 Appointment booked successfully! Redirecting to your appointments...",
                { duration: 3000 }
              );

              setTimeout(() => {
                navigate("/patient/appointments", {
                  state: {
                    showNewAppointment: true,
                    appointmentData: {
                      therapistName: therapist?.name,
                      date: selectedDate,
                      time: selectedTime,
                      visitType: visitType,
                    },
                  },
                });
              }, 2000);
              return;
            } else {
              // Appointment wasn't found, show the error
              const errorMessage =
                apiError.response?.data?.message ||
                apiError.message ||
                "Failed to book appointment. Please try again.";
              toast.error(errorMessage);
            }
          } catch (checkError) {
            // Show the original error
            const errorMessage =
              apiError.response?.data?.message ||
              apiError.message ||
              "Failed to book appointment. Please try again.";
            toast.error(errorMessage);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to book appointment. Please try again.";
      toast.error(errorMessage);
    } finally {
      setBooking(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months ahead
    return maxDate.toISOString().split("T")[0];
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

  if (!isAuthenticated || user?.role !== "patient") {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need to be logged in as a patient to book
            appointments.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 rounded-full animate-spin border-primary"></div>
          <p className="mt-4 text-gray-600">
            Loading therapist details...
          </p>
        </div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Therapist Not Found
          </h2>
          <p className="text-gray-600">
            The requested therapist could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Success Overlay */}
      {bookingSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-md p-8 mx-4 text-center bg-white rounded-lg"
          >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Appointment Booked Successfully!
            </h3>
            <p className="mb-4 text-gray-600">
              Your appointment with {therapist?.name} has been booked
              for {selectedDate && formatDate(selectedDate)} at{" "}
              {selectedTime}.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to your appointments...
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/patient/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Book Appointment
            </h1>
            <p className="text-gray-600">
              Schedule your appointment with {therapist.name}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Therapist Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Therapist Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        therapist.profilePictureUrl ||
                        "/images/team-1.svg"
                      }
                      alt={therapist.name}
                      className="object-cover w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {therapist.name}
                      </h3>
                      <p className="font-medium text-primary">
                        {therapist.specialization}
                      </p>
                    </div>
                  </div>

                  {therapist.bio && (
                    <p className="text-sm text-gray-600">
                      {therapist.bio}
                    </p>
                  )}

                  <div className="space-y-2">
                    {therapist.clinicName && (
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{therapist.clinicName}</span>
                      </div>
                    )}
                    {therapist.clinicAddress && (
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{therapist.clinicAddress}</span>
                      </div>
                    )}
                    {therapist.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{therapist.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{therapist.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Appointment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Visit Type Selection - First */}
                  <div>
                    <Label htmlFor="visitType">Visit Type *</Label>
                    <Select
                      value={visitType}
                      onValueChange={handleVisitTypeChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select how you'd like to have your appointment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clinic">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <div>
                              <div className="font-medium">
                                Clinic Visit
                              </div>
                              <div className="text-sm text-gray-500">
                                Visit the therapist's clinic
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="home">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            <div>
                              <div className="font-medium">
                                Home Visit
                              </div>
                              <div className="text-sm text-gray-500">
                                Therapist visits your location
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem value="online">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <div>
                              <div className="font-medium">
                                Online Consultation
                              </div>
                              <div className="text-sm text-gray-500">
                                Video call appointment
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection - Only show if visit type is selected */}
                  {visitType && (
                    <div>
                      <Label htmlFor="date">Select Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) =>
                          handleDateChange(e.target.value)
                        }
                        min={getMinDate()}
                        max={getMaxDate()}
                        className="mt-1"
                      />
                      {selectedDate && (
                        <p className="mt-1 text-sm text-gray-600">
                          {formatDate(selectedDate)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Time Slot Selection - Only show if both visit type and date are selected */}
                  {visitType && selectedDate && (
                    <div>
                      <Label>Select Time *</Label>
                      {loadingSlots ? (
                        <div className="py-4 mt-2 text-center">
                          <div className="w-6 h-6 mx-auto border-b-2 rounded-full animate-spin border-primary"></div>
                          <p className="mt-2 text-sm text-gray-600">
                            Loading available slots...
                          </p>
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 mt-2 md:grid-cols-4">
                          {availableSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant={
                                selectedTime === slot
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => setSelectedTime(slot)}
                              className="h-10"
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 mt-2 text-center rounded-lg bg-gray-50">
                          <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            No available slots for this date. Please
                            select another date.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Appointment Type - Show after time is selected */}
                  {visitType && selectedDate && selectedTime && (
                    <div>
                      <Label htmlFor="type">Appointment Type</Label>
                      <Select
                        value={appointmentType}
                        onValueChange={setAppointmentType}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="initial">
                            Initial Consultation
                          </SelectItem>
                          <SelectItem value="follow-up">
                            Follow-up Session
                          </SelectItem>
                          <SelectItem value="assessment">
                            Assessment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Notes - Show after appointment type */}
                  {visitType && selectedDate && selectedTime && (
                    <div>
                      <Label htmlFor="notes">
                        Additional Notes (Optional)
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any specific concerns or information you'd like to share..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  )}

                  {/* Book Button */}
                  <Button
                    onClick={handleBooking}
                    disabled={
                      !visitType ||
                      !selectedDate ||
                      !selectedTime ||
                      booking
                    }
                    className="w-full"
                    size="lg"
                  >
                    {booking ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                        Booking Appointment...
                      </>
                    ) : (
                      <>
                        <CalendarDays className="w-4 h-4 mr-2" />
                        {visitType && selectedDate && selectedTime
                          ? `Book ${
                              visitType.charAt(0).toUpperCase() +
                              visitType.slice(1)
                            } Appointment`
                          : "Book Appointment"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
