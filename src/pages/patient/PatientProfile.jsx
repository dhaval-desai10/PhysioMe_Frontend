import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "react-hot-toast";
import {
  Loader2,
  Camera,
  Edit3,
  Save,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  UserCheck,
  Star,
} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import { patientApi } from "../../services/api";

export default function PatientProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      medicalHistory: "",
    },
    mode: "onChange",
  });
  const { user, setUser } = useAuth();

  const profilePictureFile = watch("profilePicture");

  useEffect(() => {
    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profilePictureFile && profilePictureFile[0]) {
      const newPreviewUrl = URL.createObjectURL(profilePictureFile[0]);
      setPreviewUrl(newPreviewUrl);
      return () => URL.revokeObjectURL(newPreviewUrl);
    } else if (user?.profilePictureUrl) {
      setPreviewUrl(user.profilePictureUrl);
    } else {
      setPreviewUrl(
        "https://ui-avatars.com/api/?name=No+Image&background=random"
      );
    }
  }, [profilePictureFile, user?.profilePictureUrl]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (!user || !user._id) {
        toast.error("User information not available");
        setLoading(false);
        return;
      }

      // Try to fetch profile from API
      try {
        const response = await patientApi.getProfile(user._id);
        if (response.data.success) {
          const profileData = response.data.data;

          // Set profile image preview
          if (profileData.profilePictureUrl) {
            setPreviewUrl(profileData.profilePictureUrl);
          } else {
            setPreviewUrl(
              "https://ui-avatars.com/api/?name=No+Image&background=random"
            );
          }

          // Split name into firstName and lastName
          const nameParts = profileData.name?.split(" ") || ["", ""];
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          // Map the data to match the form structure
          const formData = {
            firstName,
            lastName,
            email: profileData.email || "",
            phone: profileData.phone || "",
            dateOfBirth: profileData.dateOfBirth
              ? typeof profileData.dateOfBirth === "string"
                ? profileData.dateOfBirth.split("T")[0]
                : new Date(profileData.dateOfBirth).toISOString().split("T")[0]
              : "",
            gender: profileData.gender || "",
            address: profileData.address || "",
            medicalHistory: profileData.medicalHistory || "",
          };

          reset(formData);
          return; // Successfully fetched profile
        }
      } catch (apiError) {
        // API call failed, will use user context data as fallback
      } // If API call fails or no profile data, use data from user context (registration data)
      if (user) {
        // Set profile image preview from user context
        if (user.profilePictureUrl) {
          setPreviewUrl(user.profilePictureUrl);
        } else {
          setPreviewUrl(
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.name || "User"
            )}&background=random`
          );
        }

        // Split name into firstName and lastName from user context
        const nameParts = user.name?.split(" ") || ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Pre-populate form with user registration data
        const formData = {
          firstName,
          lastName,
          email: user.email || "",
          phone: user.phone || "",
          dateOfBirth: user.dateOfBirth
            ? typeof user.dateOfBirth === "string"
              ? user.dateOfBirth.split("T")[0]
              : new Date(user.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: user.gender || "",
          address: user.address || "",
          medicalHistory: user.medicalHistory || "",
        };

        reset(formData);
      }
    } catch (error) {
      toast.error("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);

    try {
      if (!user || !user._id) {
        throw new Error("User information not available");
      }

      // Create FormData object for file upload
      const formData = new FormData();

      // Handle name (combine firstName and lastName)
      const firstName = data.firstName?.trim() || "";
      const lastName = data.lastName?.trim() || "";
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);

      // Add other form fields
      formData.append("email", data.email);
      formData.append("phone", data.phone || "");
      formData.append("dateOfBirth", data.dateOfBirth);
      formData.append("gender", data.gender || "");
      formData.append("address", data.address || "");
      formData.append("medicalHistory", data.medicalHistory || "");

      // Handle profile picture if selected
      if (data.profilePicture && data.profilePicture.length > 0) {
        const file = data.profilePicture[0];

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
          throw new Error("Please upload a valid image file (JPEG, PNG)");
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Image size should be less than 5MB");
        }

        formData.append("profilePicture", file);
      }

      const response = await patientApi.updateProfile(user._id, formData);

      if (response.data.success) {
        toast.success("Profile updated successfully");

        // Update the user data in localStorage to persist changes
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            name: response.data.data.name,
            profilePictureUrl: response.data.data.profilePictureUrl,
            phone: response.data.data.phone,
            dateOfBirth: response.data.data.dateOfBirth,
            address: response.data.data.address,
            medicalHistory: response.data.data.medicalHistory,
            emergencyContact: response.data.data.emergencyContact,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Update the auth context
          setUser(updatedUser);
        }

        // Update form with new data
        const updatedData = response.data.data;
        const nameParts = updatedData.name?.split(" ") || ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        reset({
          firstName,
          lastName,
          email: updatedData.email || "",
          phone: updatedData.phone || "",
          dateOfBirth: updatedData.dateOfBirth
            ? typeof updatedData.dateOfBirth === "string"
              ? updatedData.dateOfBirth.split("T")[0]
              : new Date(updatedData.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: updatedData.gender || "",
          address: updatedData.address || "",
          medicalHistory: updatedData.medicalHistory || "",
        });

        // Update profile picture preview
        if (updatedData.profilePictureUrl) {
          setPreviewUrl(updatedData.profilePictureUrl);
        }

        setIsEditing(false);
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      // Extract specific error message from API response
      let errorMessage = "Failed to update profile";

      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error - please check your connection";
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reload the original data
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <p className="text-sm text-gray-400">
                  Manage your personal information
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={handleEdit}
                size="sm"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Header - Compact Layout */}
            <div className="p-6 bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
              <div className="flex flex-col items-start space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-6">
                {/* Profile Image */}
                <div className="relative flex-shrink-0 group">
                  <div className="w-24 h-24 overflow-hidden bg-gray-700 border-2 border-gray-600 rounded-full">
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center transition-all duration-200 bg-black rounded-full opacity-0 cursor-pointer bg-opacity-60 group-hover:opacity-100">
                      <div className="text-center text-white">
                        <Camera className="w-5 h-5 mx-auto mb-1" />
                      </div>
                      <input
                        type="file"
                        {...register("profilePicture")}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Basic Info Grid */}
                <div className="grid flex-1 w-full grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label
                      htmlFor="firstName"
                      className="text-xs tracking-wide text-gray-400 uppercase"
                    >
                      First Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                        className="h-9 bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      />
                    ) : (
                      <p className="font-medium text-white">
                        {watch("firstName")}
                      </p>
                    )}
                    {errors.firstName && (
                      <p className="text-xs text-red-400">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="lastName"
                      className="text-xs tracking-wide text-gray-400 uppercase"
                    >
                      Last Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        {...register("lastName", {
                          required: "Last name is required",
                        })}
                        className="h-9 bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      />
                    ) : (
                      <p className="font-medium text-white">
                        {watch("lastName")}
                      </p>
                    )}
                    {errors.lastName && (
                      <p className="text-xs text-red-400">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs tracking-wide text-gray-400 uppercase">
                      Email Address
                    </Label>
                    <p className="text-sm font-medium text-white">
                      {watch("email")}
                    </p>
                  </div>
                </div>

                {!isEditing && (
                  <div className="flex-shrink-0">
                    <div className="flex items-center px-3 py-1 space-x-2 text-blue-400 border border-blue-500/50 rounded-full bg-blue-900/30">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">Patient</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Personal Information */}
            <div className="p-6 bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
              <div className="flex items-center mb-4 space-x-2">
                <User className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="phone"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      {...register("phone", {
                        pattern: {
                          value: /^[\d\s-+()]+$/,
                          message: "Invalid phone number",
                        },
                      })}
                      className="h-9 bg-gray-700 border-gray-600 text-white focus:border-blue-500 placeholder-gray-400"
                      placeholder="Enter your phone number (optional)..."
                    />
                  ) : (
                    <p className="font-medium text-white">
                      {watch("phone") || "Not provided"}
                    </p>
                  )}
                  {errors.phone && (
                    <p className="text-xs text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="dateOfBirth"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    Date of Birth
                  </Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth", {
                        required: "Date of birth is required",
                      })}
                      className="h-9 bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-white">
                      {watch("dateOfBirth")
                        ? new Date(watch("dateOfBirth")).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  )}
                  {errors.dateOfBirth && (
                    <p className="text-xs text-red-400">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="gender"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    Gender
                  </Label>
                  {isEditing ? (
                    <select
                      id="gender"
                      className="h-9 w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500"
                      {...register("gender")}
                    >
                      <option value="">Select gender (optional)</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  ) : (
                    <p className="font-medium text-white">
                      {watch("gender")
                        ? watch("gender").charAt(0).toUpperCase() +
                          watch("gender").slice(1).replace("-", " ")
                        : "Not specified"}
                    </p>
                  )}
                  {errors.gender && (
                    <p className="text-xs text-red-400">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <Label
                  htmlFor="address"
                  className="text-xs tracking-wide text-gray-400 uppercase"
                >
                  Address
                </Label>
                {isEditing ? (
                  <textarea
                    id="address"
                    {...register("address")}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 placeholder-gray-400 min-h-[80px] resize-vertical"
                    placeholder="Enter your address (optional)..."
                  />
                ) : (
                  <p className="font-medium text-white whitespace-pre-wrap">
                    {watch("address") || "No address provided"}
                  </p>
                )}
                {errors.address && (
                  <p className="text-xs text-red-400">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* Medical Information */}
            <div className="p-6 bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
              <div className="flex items-center mb-4 space-x-2">
                <Heart className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Medical Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label
                    htmlFor="medicalHistory"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    Medical History
                  </Label>
                  {isEditing ? (
                    <textarea
                      id="medicalHistory"
                      {...register("medicalHistory")}
                      placeholder="Please list any relevant medical conditions, surgeries, or injuries"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 placeholder-gray-400 min-h-[100px] resize-vertical"
                    />
                  ) : (
                    <p className="font-medium text-white whitespace-pre-wrap">
                      {watch("medicalHistory") || "No medical history provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end px-6 py-4 pt-4 -mx-6 -mb-6 space-x-3 border-t border-gray-700 bg-gray-700/50 rounded-b-xl">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  size="sm"
                  className="text-gray-300 border-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  size="sm"
                  className="text-white bg-green-600 hover:bg-green-700 border-0 shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
