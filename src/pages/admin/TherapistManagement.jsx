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
import { Search, ArrowLeft, Trash2, Edit, Eye } from "lucide-react";
import { adminApi } from "../../services/api";
import { FaUserMd } from "react-icons/fa";
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

const TherapistManagement = () => {
  const [loading, setLoading] = useState(true);
  const [therapists, setTherapists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllTherapists();
      setTherapists(response.data.data || []);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      toast.error("Failed to load therapists");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTherapist = async (therapistId, therapistName) => {
    try {
      setDeleteLoading(therapistId);

      console.log("Attempting to delete therapist from database:", therapistId);

      // Use the updated delete API that works with existing routes
      const response = await adminApi.deleteTherapist(therapistId);

      console.log("Delete response:", response);

      if (response.data.success) {
        // Remove from local state
        setTherapists(therapists.filter((t) => t._id !== therapistId));
        toast.success(
          `${therapistName} has been permanently deleted from database`
        );
      } else {
        toast.error(response.data.message || "Failed to delete therapist");
      }
    } catch (error) {
      console.error("Error deleting therapist:", error);

      if (error.response?.status === 404) {
        toast.error("Therapist not found in database");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete therapists");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to delete therapist from database"
        );
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredTherapists = therapists.filter(
    (therapist) =>
      therapist.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specialization
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      therapist.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading therapists...</p>
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
              Therapist Management
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute w-5 h-5 left-3 top-3 text-gray-400" />
              <Input
                type="search"
                placeholder="Search therapists..."
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
            <CardTitle className="text-blue-400">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {therapists.length}
                </p>
                <p className="text-gray-400">Total Therapists</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {therapists.filter((t) => t.status === "approved").length}
                </p>
                <p className="text-gray-400">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">
                  {therapists.filter((t) => t.status === "pending").length}
                </p>
                <p className="text-gray-400">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Therapists List */}
        <div className="space-y-4">
          {filteredTherapists.length > 0 ? (
            filteredTherapists.map((therapist) => (
              <Card
                key={therapist._id}
                className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={therapist.profilePicture}
                          alt={therapist.name}
                        />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {therapist.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {therapist.name}
                        </h3>
                        <p className="text-blue-400">
                          {therapist.specialization}
                        </p>
                        <p className="text-sm text-gray-400">
                          {therapist.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          therapist.status === "approved"
                            ? "default"
                            : therapist.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          therapist.status === "approved"
                            ? "bg-green-600"
                            : therapist.status === "rejected"
                            ? "bg-red-600"
                            : "bg-yellow-600"
                        }
                      >
                        {therapist.status?.charAt(0).toUpperCase() +
                          therapist.status?.slice(1)}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/admin/therapists/${therapist._id}`)
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
                              disabled={deleteLoading === therapist._id}
                            >
                              {deleteLoading === therapist._id ? (
                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-800 border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                Delete Therapist
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-300">
                                Are you sure you want to permanently delete{" "}
                                {therapist.name}? This action cannot be undone
                                and will remove all their data from the
                                database.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-700 text-gray-300 border-gray-600">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteTherapist(
                                    therapist._id,
                                    therapist.name
                                  )
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
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <FaUserMd className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No therapists found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "No therapists match your search criteria."
                    : "No therapists registered yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistManagement;
