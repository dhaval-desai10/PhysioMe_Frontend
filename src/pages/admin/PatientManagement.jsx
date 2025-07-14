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
import { Search, ArrowLeft, Trash2, Eye } from "lucide-react";
import { adminApi } from "../../services/api";
import { FaUserInjured } from "react-icons/fa";
import { useAuth } from "../../lib/AuthContext";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";

const PatientManagement = () => {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllPatients();
      let patientsData = [];
      if (response.data && response.data.data) {
        const formattedPatients = response.data.data.map((patient) => ({
          ...patient,
          name: patient.name || `${patient.firstName} ${patient.lastName}`,
          age: patient.age || calculateAge(patient.dateOfBirth),
          gender: patient.gender || "Not specified",
          medicalHistory:
            patient.medicalHistory || "No medical history provided",
        }));
        setPatients(formattedPatients);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleDeletePatient = async (patientId, patientName) => {
    try {
      setDeleteLoading(patientId);

      console.log("Attempting to delete patient from database:", patientId);

      // Use the updated delete API that works with existing routes
      const response = await adminApi.deletePatient(patientId);

      console.log("Delete response:", response);

      if (response.data.success) {
        // Remove from local state
        setPatients(patients.filter((p) => p._id !== patientId));
        toast.success(
          `${patientName} has been permanently deleted from database`
        );
      } else {
        toast.error(response.data.message || "Failed to delete patient");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);

      if (error.response?.status === 404) {
        toast.error("Patient not found in database");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete patients");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to delete patient from database"
        );
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.medicalHistory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading patients...</p>
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
              Patient Management
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute w-5 h-5 left-3 top-3 text-gray-400" />
              <Input
                type="search"
                placeholder="Search patients..."
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
            <CardTitle className="text-green-400">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {patients.length}
                </p>
                <p className="text-gray-400">Total Patients</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {patients.filter((p) => p.gender === "Male").length}
                </p>
                <p className="text-gray-400">Male Patients</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-400">
                  {patients.filter((p) => p.gender === "Female").length}
                </p>
                <p className="text-gray-400">Female Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients List */}
        <div className="space-y-4">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <Card
                key={patient._id}
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={patient.profilePicture}
                          alt={patient.name}
                        />
                        <AvatarFallback className="bg-green-600 text-white">
                          {patient.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {patient.name}
                        </h3>
                        <p className="text-gray-400">{patient.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-600/20 text-blue-400 border-blue-600"
                          >
                            {patient.gender}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-600/20 text-green-400 border-green-600"
                          >
                            {patient.age} years
                          </Badge>
                        </div>
                        {patient.medicalHistory &&
                          patient.medicalHistory !==
                            "No medical history provided" && (
                            <p className="text-xs text-gray-500 mt-1 max-w-md truncate">
                              Medical History: {patient.medicalHistory}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/patients/${patient._id}`)
                        }
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-600 text-red-400 hover:bg-red-900/20"
                            disabled={deleteLoading === patient._id}
                          >
                            {deleteLoading === patient._id ? (
                              <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>{" "}
                        <AlertDialogContent className="bg-gray-800 border-gray-700">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              Delete Patient
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-300">
                              Are you sure you want to permanently delete{" "}
                              {patient.name}? This action cannot be undone and
                              will remove all their data from the database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 text-gray-300 border-gray-600">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeletePatient(patient._id, patient.name)
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <FaUserInjured className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No patients found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "No patients match your search criteria."
                    : "No patients registered yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
