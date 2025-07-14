import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { patientApi } from "../../services/api";
import api from "../../services/api";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Search,
  Filter,
  CalendarDays,
  ListChecks,
  BarChart3,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  User,
  Calendar,
  Clock,
  MapPin,
  Check,
  ChevronsUpDown,
} from "lucide-react";

// Multi-select dropdown component with search
const MultiSelectDropdown = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  icon: Icon,
  maxDisplay = 2,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (value) => {
    const isSelected = selectedValues.includes(value);
    if (isSelected) {
      onSelectionChange(selectedValues.filter((item) => item !== value));
    } else {
      onSelectionChange([...selectedValues, value]);
    }
  };

  const displayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length <= maxDisplay) {
      return selectedValues.join(", ");
    }
    return `${selectedValues.slice(0, maxDisplay).join(", ")} +${
      selectedValues.length - maxDisplay
    } more`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="justify-between w-full transition-colors border-primary/20 focus:border-primary/50"
      >
        <div className="flex items-center">
          <Icon className="w-4 h-4 mr-2 text-primary/70" />
          <span className="truncate">{displayText()}</span>
        </div>
        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
      </Button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 border rounded-md shadow-lg top-full bg-background border-border">
          <div className="p-2 border-b">
            <Input
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="p-1 overflow-auto max-h-64">
            {filteredOptions.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className="flex items-center p-2 space-x-2 rounded-sm cursor-pointer hover:bg-accent"
                  onClick={() => handleSelect(option)}
                >
                  <Checkbox
                    checked={selectedValues.includes(option)}
                    onChange={() => handleSelect(option)}
                  />
                  <span className="flex-1 text-sm">{option}</span>
                  {selectedValues.includes(option) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// State will hold real data from API

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Get user from AuthContext
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState([]);
  const [filterCity, setFilterCity] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [exercisePlans, setExercisePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch approved therapists
  useEffect(() => {
    const fetchApprovedTherapists = async () => {
      try {
        setLoading(true);

        const response = await patientApi.getApprovedTherapists();

        if (response.data && response.data.data) {
          // Format therapist data
          const approvedTherapists = response.data.data.map((therapist) => {
            // Extract city from clinicAddress if it contains a full address
            let cityValue = therapist.city || "Location not specified";

            if (therapist.clinicAddress) {
              // If clinicAddress contains a city, try to extract it
              const addressParts = therapist.clinicAddress
                .split(",")
                .map((part) => part.trim());
              if (addressParts.length > 1) {
                // Assume the last part is the city/location
                cityValue = addressParts[addressParts.length - 1];
              } else {
                cityValue = therapist.clinicAddress;
              }
            }

            return {
              ...therapist,
              name: therapist.name || "Unknown Therapist",
              specialization:
                therapist.specialization || "General Physiotherapy",
              experience: therapist.experience || "0",
              city: cityValue,
              fullAddress:
                therapist.clinicAddress || therapist.address || cityValue,
              status: "approved", // Ensure status is set
            };
          });

          setTherapists(approvedTherapists);
          setError(null);
        } else {
          setTherapists([]);
          setError("No therapists available at the moment.");
        }
      } catch (err) {
        if (err.response?.status === 403) {
          setError(
            "You do not have permission to view therapists. Please contact support."
          );
        } else if (err.response?.status === 401) {
          setError("Please log in to view therapists.");
          // Redirect to login if not authenticated
          navigate("/login");
        } else if (err.response?.status === 404) {
          setError(
            "The therapists list is currently unavailable. Please try again later."
          );
        } else {
          setError("Failed to load therapists. Please try again later.");
        }
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.role === "patient") {
      fetchApprovedTherapists();
    } else {
      setError("Please log in as a patient to view therapists.");
      setTherapists([]);
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        navigate("/login");
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch patient's appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?._id) return;

      try {
        const response = await patientApi.getMyAppointments();

        if (response.data.success) {
          setAppointments(response.data.data);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        setAppointments([]);
      }
    };

    if (isAuthenticated && user?.role === "patient") {
      fetchAppointments();
    }
  }, [isAuthenticated, user]);

  // Fetch exercise plans/treatment plans
  useEffect(() => {
    const fetchExercisePlans = async () => {
      if (!user?._id) return;

      try {
        const response = await api.get(`/treatment-plans`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setExercisePlans(response.data.data);
        } else {
          setExercisePlans([]);
        }
      } catch (error) {
        console.error("Error fetching exercise plans:", error);
        setExercisePlans([]);
      }
    };

    if (isAuthenticated && user?.role === "patient") {
      fetchExercisePlans();
    }
  }, [isAuthenticated, user]);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "patient") {
      navigate("/"); // Redirect if not authenticated or not a patient
    }
  }, [isAuthenticated, user, navigate]);

  // Helper functions for appointments
  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointments
      .filter((appt) => {
        const appointmentDate = new Date(appt.date);
        return (
          appointmentDate >= today &&
          (appt.status === "pending" || appt.status === "confirmed")
        );
      })
      .slice(0, 2); // Show only first 2 for dashboard
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Filter logic for therapists
  const filteredTherapists = therapists.filter(
    (therapist) =>
      therapist.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterSpecialization.length === 0 ||
        filterSpecialization.some(
          (spec) =>
            therapist.specialization?.toLowerCase() === spec.toLowerCase()
        )) &&
      (filterCity.length === 0 ||
        filterCity.some((city) =>
          therapist.city?.toLowerCase().includes(city.toLowerCase())
        ))
  );

  const handleCancelBooking = (appointmentId) => {
    // Placeholder: Implement actual cancellation logic
    alert(`Booking cancellation requested for appointment ${appointmentId}.`);
  };

  if (!user) {
    return <div className="p-8 text-center">Loading dashboard...</div>; // Or a loading spinner
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className="py-8 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container px-4 mx-auto">
        <motion.div
          className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center"
          variants={itemVariants}
        >
          <div>
            <h1 className="mb-1 text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              Patient Dashboard
            </h1>
            <p className="flex items-center text-slate-300">
              <User size={16} className="mr-2 text-cyan-400" />
              Welcome back, {user.name || "Patient"}!
            </p>
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column (or Main Content for smaller screens) */}
          <div className="space-y-8 lg:col-span-2">
            {/* Find a Therapist Section */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden transition-shadow duration-300 shadow-md border-primary/10 hover:shadow-lg">
                <CardHeader className="border-b bg-primary/5 border-primary/10">
                  <CardTitle className="flex items-center text-primary">
                    <Search className="w-5 h-5 mr-2 text-primary" />
                    Find a Physiotherapist
                  </CardTitle>
                  <CardDescription>
                    Search and filter to find the right therapist for your
                    needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <motion.div
                    className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 transition-colors md:col-span-1 border-primary/20 focus:border-primary/50"
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <MultiSelectDropdown
                        options={Array.from(
                          new Set(therapists.map((t) => t.specialization))
                        )
                          .filter(Boolean)
                          .sort()}
                        selectedValues={filterSpecialization}
                        onSelectionChange={setFilterSpecialization}
                        placeholder="Filter by Specialization"
                        icon={Filter}
                        maxDisplay={2}
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <MultiSelectDropdown
                        options={Array.from(
                          new Set(therapists.map((t) => t.city))
                        )
                          .filter(Boolean)
                          .filter((city) => city !== "Location not specified")
                          .sort()}
                        selectedValues={filterCity}
                        onSelectionChange={setFilterCity}
                        placeholder="Filter by City"
                        icon={MapPin}
                        maxDisplay={2}
                      />
                    </motion.div>
                  </motion.div>

                  {/* Active filters display */}
                  {(searchTerm ||
                    filterSpecialization.length > 0 ||
                    filterCity.length > 0) && (
                    <motion.div
                      className="flex flex-wrap gap-2 mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {searchTerm && (
                        <Badge variant="secondary" className="text-sm">
                          Search: "{searchTerm}"
                          <button
                            onClick={() => setSearchTerm("")}
                            className="ml-2 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      )}
                      {filterSpecialization.map((spec) => (
                        <Badge
                          key={spec}
                          variant="secondary"
                          className="text-sm"
                        >
                          Spec: {spec}
                          <button
                            onClick={() =>
                              setFilterSpecialization(
                                filterSpecialization.filter((s) => s !== spec)
                              )
                            }
                            className="ml-2 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                      {filterCity.map((city) => (
                        <Badge
                          key={city}
                          variant="secondary"
                          className="text-sm"
                        >
                          City: {city}
                          <button
                            onClick={() =>
                              setFilterCity(
                                filterCity.filter((c) => c !== city)
                              )
                            }
                            className="ml-2 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </motion.div>
                  )}

                  {/* Clear filters button */}
                  {(searchTerm ||
                    filterSpecialization.length > 0 ||
                    filterCity.length > 0) && (
                    <motion.div
                      className="flex justify-center mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterSpecialization([]);
                          setFilterCity([]);
                        }}
                        className="border-primary/20 text-primary hover:bg-primary/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Clear All Filters
                      </Button>
                    </motion.div>
                  )}

                  {/* Results count */}
                  <motion.div
                    className="mb-4 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Showing {filteredTherapists.length} of {therapists.length}{" "}
                    therapists
                    {(searchTerm ||
                      filterSpecialization.length > 0 ||
                      filterCity.length > 0) && (
                      <span className="ml-1 text-primary">(filtered)</span>
                    )}
                  </motion.div>

                  <motion.div
                    className="pr-1 space-y-4 overflow-y-auto max-h-96"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {loading ? (
                      <motion.div
                        className="flex items-center justify-center py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="ml-2 font-medium text-primary/80">
                          Loading therapists...
                        </span>
                      </motion.div>
                    ) : error ? (
                      <motion.div
                        className="py-6 text-center text-red-500 rounded-lg bg-red-50 dark:bg-red-900/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                        <p className="font-medium">{error}</p>
                      </motion.div>
                    ) : filteredTherapists.length > 0 ? (
                      filteredTherapists.map((therapist, index) => (
                        <motion.div
                          key={therapist._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Card className="flex flex-col items-start justify-between p-4 overflow-hidden sm:flex-row sm:items-center border-primary/10">
                            <div>
                              <h3 className="text-lg font-semibold text-primary/90">
                                {therapist.name}
                              </h3>
                              <p className="flex items-center mt-1 text-sm text-muted-foreground">
                                <MapPin
                                  size={14}
                                  className="mr-1 text-primary/70"
                                />
                                {therapist.specialization} -{" "}
                                {therapist.fullAddress}
                              </p>
                              {therapist.workingHours && (
                                <p className="flex items-center mt-1 text-sm text-muted-foreground">
                                  <Clock
                                    size={14}
                                    className="mr-1 text-primary/70"
                                  />
                                  {therapist.workingHours.start} -{" "}
                                  {therapist.workingHours.end}
                                  {therapist.appointmentDuration && (
                                    <span className="ml-2 text-xs bg-primary/10 px-2 py-0.5 rounded">
                                      {therapist.appointmentDuration}min slots
                                    </span>
                                  )}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge
                                  variant="outline"
                                  className="bg-primary/5 border-primary/20 text-primary/80"
                                >
                                  {therapist.experience} years exp.
                                </Badge>
                                {therapist.status === "approved" && (
                                  <Badge className="flex items-center gap-1 text-green-800 bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                                    <CheckCircle2 size={12} />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Link
                                  to={`/therapist/${therapist._id}/profile`}
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full sm:w-auto"
                                  >
                                    View Profile
                                  </Button>
                                </Link>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Link to={`/therapist/${therapist._id}/book`}>
                                  <Button
                                    size="sm"
                                    className="w-full transition-all duration-300 border-0 shadow-lg sm:w-auto bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 hover:shadow-xl"
                                  >
                                    Book Appointment
                                  </Button>
                                </Link>
                              </motion.div>
                            </div>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        className="py-8 text-center rounded-lg bg-primary/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Search className="w-10 h-10 mx-auto mb-2 text-primary/40" />
                        <p className="font-medium text-muted-foreground">
                          No therapists match your criteria.
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Try adjusting your filters.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* My Appointments Section */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden transition-shadow duration-300 shadow-md border-primary/10 hover:shadow-lg">
                <CardHeader className="border-b bg-primary/5 border-primary/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-primary">
                      <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                      My Appointments
                    </CardTitle>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link to="/patient/appointments">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/20 hover:border-primary/50"
                        >
                          View All
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {getUpcomingAppointments().length > 0 ? (
                    <motion.ul
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.1 }}
                    >
                      {getUpcomingAppointments().map((appt, index) => (
                        <motion.li
                          key={appt._id}
                          className="p-4 transition-all border rounded-lg shadow-sm bg-card dark:bg-card/80 border-primary/10 hover:shadow-md"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -2 }}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-primary/90">
                              {appt.therapistName}
                            </p>
                            <Badge
                              variant={
                                appt.status === "approved"
                                  ? "default"
                                  : appt.status === "pending"
                                  ? "secondary"
                                  : appt.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                              }
                              className={`
                                ${
                                  appt.status === "approved"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : ""
                                }
                                ${
                                  appt.status === "pending"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                    : ""
                                }
                                ${
                                  appt.status === "rejected"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    : ""
                                }
                              `}
                            >
                              {appt.status === "approved" && (
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                              )}
                              {appt.status === "pending" && (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {appt.status === "rejected" && (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {appt.status.charAt(0).toUpperCase() +
                                appt.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                            {new Date(appt.date).toLocaleDateString()} at{" "}
                            {appt.time}
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                              {appt.service}
                            </p>
                          </div>
                          <motion.div
                            className="mt-3"
                            whileHover={{ x: 5 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <Link to={`/patient/appointments`}>
                              <Button
                                variant="link"
                                size="sm"
                                className="flex items-center h-auto gap-1 p-0 text-primary"
                              >
                                View Details
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6 12L10 8L6 4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </Button>
                            </Link>
                          </motion.div>
                        </motion.li>
                      ))}
                    </motion.ul>
                  ) : (
                    <motion.div
                      className="py-8 text-center rounded-lg bg-primary/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CalendarDays className="w-10 h-10 mx-auto mb-2 text-primary/40" />
                      <p className="font-medium text-muted-foreground">
                        No upcoming appointments.
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Book an appointment with a therapist.
                      </p>
                    </motion.div>
                  )}
                  <motion.div
                    className="mt-6"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link to="/patient/appointments" className="block">
                      <Button className="w-full shadow-sm">
                        Manage Appointments
                      </Button>
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column (Sidebar for larger screens) */}
          <div className="space-y-8 lg:col-span-1">
            {/* My Exercise Plan Section */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden transition-shadow duration-300 shadow-md border-primary/10 hover:shadow-lg">
                <CardHeader className="border-b bg-primary/5 border-primary/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-primary">
                      <ListChecks className="w-5 h-5 mr-2 text-primary" />
                      My Exercise Plan
                    </CardTitle>
                    {exercisePlans.length > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={`/patient/exercise-plan/${
                            exercisePlans[0]._id || "current"
                          }`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary/20 hover:border-primary/50"
                          >
                            View Plan
                          </Button>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {exercisePlans.length > 0 ? (
                    <motion.div
                      className="p-4 border rounded-lg shadow-sm bg-card dark:bg-card/80 border-primary/10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{
                        y: -2,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <h3 className="font-medium text-primary/90">
                        {exercisePlans[0].title}
                      </h3>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4 mr-2 text-primary/70" />
                        Assigned by:{" "}
                        {exercisePlans[0].physiotherapistId?.name ||
                          "Your Therapist"}
                      </div>

                      <div className="mt-4 space-y-3">
                        {(exercisePlans[0].exercises || [])
                          .slice(0, 2)
                          .map((exercise, index) => (
                            <motion.div
                              key={index}
                              className="p-2 text-sm rounded-md bg-primary/5"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="font-medium">
                                {exercise.exerciseId?.name || exercise.name}
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {exercise.sets} sets × {exercise.reps} reps
                              </div>
                            </motion.div>
                          ))}
                        {(exercisePlans[0].exercises || []).length > 2 && (
                          <div className="mt-1 text-xs text-center text-muted-foreground">
                            +{(exercisePlans[0].exercises || []).length - 2}{" "}
                            more exercises
                          </div>
                        )}
                      </div>

                      <motion.div
                        className="mt-4"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Link
                          to={`/patient/exercise-plan/${
                            exercisePlans[0]._id || "current"
                          }`}
                        >
                          <Button
                            variant="link"
                            size="sm"
                            className="flex items-center h-auto gap-1 p-0 text-primary"
                          >
                            Continue Plan
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6 12L10 8L6 4"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="py-8 text-center rounded-lg bg-primary/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ListChecks className="w-10 h-10 mx-auto mb-2 text-primary/40" />
                      <p className="font-medium text-muted-foreground">
                        No active exercise plan.
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your therapist will assign one soon.
                      </p>
                    </motion.div>
                  )}
                  <motion.div
                    className="mt-6"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {exercisePlans.length === 0 ? (
                      <Button className="w-full shadow-sm" disabled>
                        No Plan Assigned
                      </Button>
                    ) : (
                      <Link
                        to={`/patient/exercise-plan/${
                          exercisePlans[0]._id || "current"
                        }`}
                        className="block"
                      >
                        <Button className="w-full shadow-sm">
                          Access Full Exercise Plan
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Daily Progress Log & Chart Section */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden transition-shadow duration-300 shadow-md border-primary/10 hover:shadow-lg">
                <CardHeader className="border-b bg-primary/5 border-primary/10">
                  <CardTitle className="flex items-center text-primary">
                    <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                    Daily Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Placeholder for progress log input and chart */}
                  <motion.p
                    className="mb-4 text-center text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Log your daily activities and see your progress over time.
                  </motion.p>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mb-6"
                  >
                    <Button className="w-full transition-all duration-300 border-0 shadow-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 hover:shadow-xl">
                      Log Today's Progress
                    </Button>
                  </motion.div>

                  <motion.div
                    className="overflow-hidden border rounded-lg border-primary/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div className="p-3 border-b bg-primary/5 border-primary/10">
                      <h3 className="flex items-center text-sm font-medium text-primary/90">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Weekly Activity
                      </h3>
                    </div>
                    <div className="flex flex-col items-center justify-center h-48 p-4 bg-card dark:bg-card/80">
                      <div className="flex items-end justify-around w-full h-full gap-2">
                        {[35, 60, 45, 80, 55, 30, 65].map((height, index) => (
                          <motion.div
                            key={index}
                            className="w-full rounded-t-sm bg-primary/70"
                            style={{ height: `${height}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{
                              delay: 0.3 + index * 0.1,
                              duration: 0.5,
                              type: "spring",
                            }}
                            whileHover={{ backgroundColor: "var(--primary)" }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-around w-full mt-2">
                        {["M", "T", "W", "T", "F", "S", "S"].map(
                          (day, index) => (
                            <div
                              key={index}
                              className="text-xs text-muted-foreground"
                            >
                              {day}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
