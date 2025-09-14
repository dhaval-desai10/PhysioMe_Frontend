import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Service Pages
import PhysicalTherapy from "./pages/our_services/PhysicalTherapy";
import SportsRehabilitation from "./pages/our_services/SportsRehabilitation";
import ManualTherapy from "./pages/our_services/ManualTherapy";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import PatientProfile from "./pages/patient/PatientProfile";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientExercisePlan from "./pages/patient/ExercisePlan";
import BookAppointment from "./pages/patient/BookAppointment";
import TherapistProfileView from "./pages/patient/TherapistProfileView";
import ProgressTracker from "./pages/patient/ProgressTracker";
import ProgressReport from "./pages/patient/ProgressReport";

// Therapist Pages
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import TherapistProfile from "./pages/therapist/TherapistProfile";
import TherapistAvailability from "./pages/therapist/TherapistAvailability";
import TherapistAppointments from "./pages/therapist/TherapistAppointments";
import Patients from "./pages/therapist/Patients";
import PatientProfileView from "./pages/therapist/PatientProfileView";
import TherapistExercisePlan from "./pages/therapist/ExercisePlan";
import ProgressOverview from "./pages/therapist/ProgressOverview";
import ProgressDashboard from "./pages/therapist/ProgressDashboard";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import TherapistApprovals from "./pages/admin/TherapistApprovals";
import TherapistDetails from "./pages/admin/TherapistDetails";
import PatientDetails from "./pages/admin/PatientDetails";
import TherapistManagement from "./pages/admin/TherapistManagement";
import PatientManagement from "./pages/admin/PatientManagement";
import AppointmentManagement from "./pages/admin/AppointmentManagement";
import LoadingScreen from "./components/LoadingScreen";

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Service Pages */}
      <Route
        path="/services/physical-therapy"
        element={<PhysicalTherapy />}
      />
      <Route
        path="/services/sports-rehabilitation"
        element={<SportsRehabilitation />}
      />
      <Route
        path="/services/manual-therapy"
        element={<ManualTherapy />}
      />

      {/* Protected Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/exercise-plan/:planId"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientExercisePlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/exercise-plan"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientExercisePlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/progress"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <ProgressTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/progress-report"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <ProgressReport />
          </ProtectedRoute>
        }
      />

      {/* Therapist Profile View Route */}
      <Route
        path="/therapist/:therapistId/profile"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <TherapistProfileView />
          </ProtectedRoute>
        }
      />

      {/* Book Appointment Route */}
      <Route
        path="/therapist/:therapistId/book"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <BookAppointment />
          </ProtectedRoute>
        }
      />

      {/* Protected Therapist Routes */}
      <Route
        path="/therapist/dashboard"
        element={
          <ProtectedRoute allowedRoles={["physiotherapist"]}>
            <TherapistDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist/patients"
        element={
          <ProtectedRoute allowedRoles={["physiotherapist"]}>
            <Patients />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist/patient/:patientId"
        element={
          <ProtectedRoute allowedRoles={["physiotherapist"]}>
            <PatientProfileView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist/profile"
        element={
          <ProtectedRoute allowedRoles={["physiotherapist"]}>
            <TherapistProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist/availability"
        element={
          <ProtectedRoute allowedRoles={["physiotherapist"]}>
            <TherapistAvailability />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist/appointments"
        element={
          <ProtectedRoute allowedRoles={["physiotherapist"]}>
            <TherapistAppointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist/exercise-plan"
        element={
          <ProtectedRoute allowedRoles={["physiotherapist"]}>
            <TherapistExercisePlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist/exercise-plan/:patientId"
        element={
          <ProtectedRoute allowedRoles={["physiotherapist"]}>
            <TherapistExercisePlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist/progress-overview"
        element={
          <ProtectedRoute allowedRoles={["physiotherapist"]}>
            <ProgressOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapist/progress/:patientId"
        element={
          <ProtectedRoute allowedRoles={["physiotherapist"]}>
            <ProgressDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/therapist-approvals"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <TherapistApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/approvals"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <TherapistApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/therapists"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <TherapistManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PatientManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppointmentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/therapists/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <TherapistDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <PatientDetails />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 pt-16">
          <AppRoutes />
        </main>
        <Footer />

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            // Define default options
            className: "",
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
              padding: "16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 9999,
            },
            // Default options for specific types
            success: {
              duration: 3000,
              style: {
                background: "#10b981",
                color: "#fff",
              },
            },
            error: {
              duration: 4000,
              style: {
                background: "#ef4444",
                color: "#fff",
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
