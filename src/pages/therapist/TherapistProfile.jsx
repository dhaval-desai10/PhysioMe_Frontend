import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "react-hot-toast";
import { therapistApi } from "../../services/api";
import { useAuth } from "../../lib/AuthContext";
import {
  Camera,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Award,
  FileText,
  Building,
  Edit3,
  Save,
  X,
  UserCheck,
  Briefcase,
  Star,
} from "lucide-react";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const WORKING_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DEFAULT_WORKING_HOURS = {
  start: "09:00",
  end: "17:00",
};

export default function TherapistProfile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      experience: 0,
      licenseNumber: "",
      clinicName: "",
      clinicAddress: "",
      bio: "",
      workingHours: DEFAULT_WORKING_HOURS,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
    mode: "onChange",
  });

  const profilePictureFile = watch("profilePicture");
  const workingDays = watch("workingDays") || [];
  const workingHours = watch("workingHours") || DEFAULT_WORKING_HOURS;

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
      const response = await therapistApi.getProfile(user._id);
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
          specialization: profileData.specialization || "",
          experience: profileData.experience || 0,
          licenseNumber: profileData.licenseNumber || "",
          clinicName: profileData.clinicName || "",
          clinicAddress: profileData.clinicAddress || "",
          bio: profileData.bio || "",
          workingHours: profileData.workingHours || DEFAULT_WORKING_HOURS,
          workingDays: profileData.workingDays || [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
        };

        // Debug: Check bio value being loaded
        console.log("Bio value from profile:", profileData.bio);
        console.log("Bio value in form data:", formData.bio);

        // Only use reset, not setValue to avoid conflicts
        reset(formData);
      } else {
        throw new Error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWorkingDayChange = (day) => {
    const currentDays = watch("workingDays") || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    setValue("workingDays", newDays);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (!user || !user._id) {
        throw new Error("User information not available");
      }

      // Create FormData object
      const formData = new FormData();

      // Handle name (combine firstName and lastName)
      const firstName = data.firstName?.trim() || "";
      const lastName = data.lastName?.trim() || "";
      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) {
        formData.append("name", fullName);
      }

      // Add basic form fields
      if (data.email) formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.specialization)
        formData.append("specialization", data.specialization);
      if (data.experience !== undefined)
        formData.append("experience", data.experience.toString());
      if (data.licenseNumber)
        formData.append("licenseNumber", data.licenseNumber);
      if (data.clinicName) formData.append("clinicName", data.clinicName);

      // Always send bio and clinicAddress fields, even if empty
      const clinicAddressValue = data.clinicAddress || "";
      const bioValue = data.bio || "";

      formData.append("clinicAddress", clinicAddressValue);
      formData.append("bio", bioValue);

      // Handle working hours and days as JSON strings
      const workingHours = data.workingHours || DEFAULT_WORKING_HOURS;
      const workingDays = data.workingDays || [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ];

      formData.append("workingHours", JSON.stringify(workingHours));
      formData.append("workingDays", JSON.stringify(workingDays));

      // Handle profile picture upload
      if (data.profilePicture && data.profilePicture.length > 0) {
        const file = data.profilePicture[0];
        formData.append("profilePicture", file, file.name);
      }

      const response = await therapistApi.updateProfile(user._id, formData);

      if (response.data.success) {
        toast.success("Profile updated successfully");

        // Update the user data in localStorage and context
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            name: response.data.data.name,
            email: response.data.data.email,
            phone: response.data.data.phone,
            specialization: response.data.data.specialization,
            experience: response.data.data.experience,
            licenseNumber: response.data.data.licenseNumber,
            clinicName: response.data.data.clinicName,
            clinicAddress: response.data.data.clinicAddress,
            bio: response.data.data.bio,
            profilePictureUrl: response.data.data.profilePictureUrl,
            workingHours: response.data.data.workingHours,
            workingDays: response.data.data.workingDays,
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
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
          specialization: updatedData.specialization || "",
          experience: updatedData.experience || 0,
          licenseNumber: updatedData.licenseNumber || "",
          clinicName: updatedData.clinicName || "",
          clinicAddress: updatedData.clinicAddress || "",
          bio: updatedData.bio || "",
          workingHours: updatedData.workingHours || DEFAULT_WORKING_HOURS,
          workingDays: updatedData.workingDays || [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
          ],
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
      console.error("Error updating profile:", error);

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
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
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
              <div className="p-2 rounded-lg bg-blue-900/50">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Profile</h1>
                <p className="text-sm text-gray-400">
                  Manage your professional information
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={handleEdit}
                size="sm"
                className="flex items-center space-x-2 text-white transition-all duration-200 bg-blue-600 border-0 shadow-lg hover:bg-blue-700 hover:shadow-xl"
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
                        className="text-white bg-gray-700 border-gray-600 h-9 focus:border-blue-500"
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
                        className="text-white bg-gray-700 border-gray-600 h-9 focus:border-blue-500"
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
                    <div className="flex items-center px-3 py-1 space-x-2 text-blue-400 border rounded-full border-blue-500/50 bg-blue-900/30">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">Professional</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="p-6 bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
              <div className="flex items-center mb-4 space-x-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Professional Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="specialization"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    Specialization
                  </Label>
                  {isEditing ? (
                    <Input
                      id="specialization"
                      {...register("specialization", {
                        required: "Specialization is required",
                        minLength: {
                          value: 2,
                          message:
                            "Specialization must be at least 2 characters",
                        },
                      })}
                      className="text-white bg-gray-700 border-gray-600 h-9 focus:border-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-white">
                      {watch("specialization")}
                    </p>
                  )}
                  {errors.specialization && (
                    <p className="text-xs text-red-400">
                      {errors.specialization.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="experience"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    Experience
                  </Label>
                  {isEditing ? (
                    <Input
                      id="experience"
                      type="number"
                      {...register("experience", {
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "Experience cannot be negative",
                        },
                      })}
                      className="text-white bg-gray-700 border-gray-600 h-9 focus:border-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-white">
                      {watch("experience")} years
                    </p>
                  )}
                  {errors.experience && (
                    <p className="text-xs text-red-400">
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="phone"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    Contact Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      {...register("phone")}
                      className="text-white bg-gray-700 border-gray-600 h-9 focus:border-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-white">{watch("phone")}</p>
                  )}
                  {errors.phone && (
                    <p className="text-xs text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="licenseNumber"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    License Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="licenseNumber"
                      {...register("licenseNumber", {
                        required: "License number is required",
                        minLength: {
                          value: 3,
                          message:
                            "License number must be at least 3 characters",
                        },
                      })}
                      className="text-white bg-gray-700 border-gray-600 h-9 focus:border-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-white">
                      {watch("licenseNumber")}
                    </p>
                  )}
                  {errors.licenseNumber && (
                    <p className="text-xs text-red-400">
                      {errors.licenseNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="clinicName"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    Clinic Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="clinicName"
                      {...register("clinicName")}
                      className="text-white bg-gray-700 border-gray-600 h-9 focus:border-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-white">
                      {watch("clinicName") || "Not specified"}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="clinicAddress"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    Clinic Address
                  </Label>
                  {isEditing ? (
                    <>
                      <Input
                        id="clinicAddress"
                        {...register("clinicAddress")}
                        placeholder="Enter clinic address..."
                        className="text-white placeholder-gray-400 bg-gray-700 border-gray-600 h-9 focus:border-blue-500"
                      />
                      <p className="text-xs text-gray-500">
                        Current value: "{watch("clinicAddress")}"
                      </p>
                    </>
                  ) : (
                    <p className="font-medium text-white">
                      {watch("clinicAddress") || "Not specified"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <Label
                  htmlFor="bio"
                  className="text-xs tracking-wide text-gray-400 uppercase"
                >
                  Professional Bio
                </Label>
                {isEditing ? (
                  <>
                    <Textarea
                      id="bio"
                      {...register("bio", {
                        maxLength: {
                          value: 500,
                          message: "Bio cannot exceed 500 characters",
                        },
                      })}
                      value={watch("bio")}
                      onChange={(e) => setValue("bio", e.target.value)}
                      placeholder="Tell patients about your experience and approach to treatment..."
                      className="text-white placeholder-gray-400 bg-gray-700 border-gray-600 focus:border-blue-500 min-h-[100px] resize-vertical"
                    />
                    <p className="text-xs text-gray-500">
                      Current value: "{watch("bio")}"
                    </p>
                  </>
                ) : (
                  <p className="font-medium text-white whitespace-pre-wrap">
                    {watch("bio") || "No bio provided"}
                  </p>
                )}
                {errors.bio && (
                  <p className="text-xs text-red-400">{errors.bio.message}</p>
                )}
              </div>
            </div>

            {/* Working Hours and Appointment Settings */}
            <div className="p-6 bg-gray-800 border border-gray-700 shadow-lg rounded-xl">
              <div className="flex items-center mb-4 space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">
                  Appointment Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                <div className="space-y-1">
                  <Label
                    htmlFor="workingHours.start"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    Start Time
                  </Label>
                  {isEditing ? (
                    <Input
                      id="workingHours.start"
                      type="time"
                      {...register("workingHours.start", {
                        required: "Start time is required",
                      })}
                      defaultValue={workingHours.start}
                      onChange={(e) => {
                        setValue("workingHours.start", e.target.value);
                      }}
                      className="text-white bg-gray-700 border-gray-600 h-9 focus:border-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-white">
                      {workingHours.start}
                    </p>
                  )}
                  {errors.workingHours?.start && (
                    <p className="text-xs text-red-400">
                      {errors.workingHours.start.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="workingHours.end"
                    className="text-xs tracking-wide text-gray-400 uppercase"
                  >
                    End Time
                  </Label>
                  {isEditing ? (
                    <Input
                      id="workingHours.end"
                      type="time"
                      {...register("workingHours.end", {
                        required: "End time is required",
                        validate: (value) => {
                          const startTime = watch("workingHours.start");
                          if (startTime && value) {
                            const start = new Date(
                              `1970-01-01T${startTime}:00`
                            );
                            const end = new Date(`1970-01-01T${value}:00`);
                            return (
                              end > start || "End time must be after start time"
                            );
                          }
                          return true;
                        },
                      })}
                      defaultValue={workingHours.end}
                      onChange={(e) => {
                        setValue("workingHours.end", e.target.value);
                      }}
                      className="text-white bg-gray-700 border-gray-600 h-9 focus:border-blue-500"
                    />
                  ) : (
                    <p className="font-medium text-white">{workingHours.end}</p>
                  )}
                  {errors.workingHours?.end && (
                    <p className="text-xs text-red-400">
                      {errors.workingHours.end.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Working Days */}
              <div className="space-y-3">
                <Label className="text-xs tracking-wide text-gray-400 uppercase">
                  Working Days
                </Label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {WORKING_DAYS.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`workingDay-${day}`}
                        checked={workingDays.includes(day)}
                        onCheckedChange={() => handleWorkingDayChange(day)}
                        disabled={!isEditing}
                        className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <label
                        htmlFor={`workingDay-${day}`}
                        className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day}
                      </label>
                    </div>
                  ))}
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
                  className="text-gray-300 transition-all duration-200 border-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  size="sm"
                  className="text-white transition-all duration-200 bg-green-600 border-0 shadow-lg hover:bg-green-700 hover:shadow-xl"
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
