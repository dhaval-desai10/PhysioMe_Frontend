import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "react-hot-toast";
import { PlusCircle, Trash2, Save } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import api from "../../services/api";

export default function ExercisePlan() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      patientId: patientId || "",
      goals: "",
      duration: 4,
      exercises: [
        {
          name: "",
          sets: 3,
          reps: 10,
          instructions: "",
          videoLink: "",
          frequency: "daily",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Set patientId if provided in URL params
        if (patientId) {
          setValue("patientId", patientId);
        }

        // Fetch patients and exercises in parallel
        await Promise.all([!patientId && fetchPatients(), fetchExercises()]);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [patientId, setValue]);

  const fetchPatients = async () => {
    try {
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
            acc.push({
              _id: patientId,
              name: appointment.patientId.name,
              email: appointment.patientId.email,
            });
          }
          return acc;
        }, []);

        setPatients(uniquePatients);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.error("Failed to load patients list");
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await api.get("/exercises", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setExercises(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      // Don't show error toast for exercises as it's not critical
    }
  };

  const createExercise = async (exerciseData) => {
    try {
      const response = await api.post(
        "/exercises/for-treatment-plan",
        {
          name: exerciseData.name,
          description: exerciseData.instructions,
          mediaUrl:
            exerciseData.videoLink ||
            "https://via.placeholder.com/400x300?text=Exercise+Video",
          mediaType: exerciseData.videoLink ? "video" : "image",
          instructions: exerciseData.instructions,
          targetArea: "General",
          difficulty: "beginner",
          recommendedSets: exerciseData.sets,
          recommendedReps: exerciseData.reps,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        return response.data.data._id;
      }
      throw new Error("Failed to create exercise");
    } catch (error) {
      console.error("Error creating exercise:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {

      // Validate required fields
      const currentPatientId = data.patientId || patientId;
      if (
        !data.title ||
        !data.description ||
        !data.goals ||
        !currentPatientId
      ) {
        const missingFields = [];
        if (!data.title) missingFields.push("Plan Title");
        if (!data.description) missingFields.push("Plan Description");
        if (!data.goals) missingFields.push("Treatment Goals");
        if (!currentPatientId) missingFields.push("Patient Selection");

        toast.error(`Please fill in: ${missingFields.join(", ")}`);
        setSaving(false);
        return;
      }

      // Validate exercises
      for (let i = 0; i < data.exercises.length; i++) {
        const exercise = data.exercises[i];
        if (!exercise.name || !exercise.instructions) {
          toast.error(`Please fill in all fields for Exercise ${i + 1}`);
          setSaving(false);
          return;
        }
      }

      // Create exercises first and get their IDs
      const exerciseIds = [];

      for (const exercise of data.exercises) {
        try {
          const exerciseId = await createExercise(exercise);
          exerciseIds.push({
            exerciseId,
            sets: exercise.sets,
            reps: exercise.reps,
            frequency: exercise.frequency || "daily",
            notes: exercise.instructions,
          });
        } catch (error) {
          console.error("Failed to create exercise:", exercise.name);
          // Continue with other exercises
        }
      }

      if (exerciseIds.length === 0) {
        throw new Error("No exercises were created successfully");
      }

      // Create treatment plan with exercise references
      const treatmentPlanData = {
        patientId: data.patientId || patientId,
        title: data.title,
        description: data.description,
        goals: [data.goals], // Convert single goal to array
        duration: data.duration,
        exercises: exerciseIds,
      };

      console.log("Sending treatment plan data:", treatmentPlanData); // Debug log

      const response = await api.post("/treatment-plans", treatmentPlanData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success("Exercise plan created successfully!");
        navigate("/therapist/dashboard");
      } else {
        throw new Error("Failed to create treatment plan");
      }
    } catch (error) {
      console.error("Error creating exercise plan:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "Failed to create exercise plan");
      }
    } finally {
      setSaving(false);
    }
  };

 

  const addExercise = () => {
    append({
      name: "",
      sets: 3,
      reps: 10,
      instructions: "",
      videoLink: "",
      frequency: "daily",
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Create Exercise Plan</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>
                Create a personalized exercise plan for your patient
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Plan Title</Label>
                  <Input
                    id="title"
                    {...register("title", {
                      required: "Plan title is required",
                    })}
                    placeholder="e.g., Knee Rehabilitation - Week 1"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="52"
                    {...register("duration", {
                      required: "Duration is required",
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: "Duration must be at least 1 week",
                      },
                    })}
                    placeholder="4"
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500">
                      {errors.duration.message}
                    </p>
                  )}
                </div>
              </div>{" "}
              {!patientId && (
                <div className="space-y-2">
                  <Label htmlFor="patientId">Select Patient</Label>
                  <select
                    id="patientId"
                    className="w-full p-2 border rounded-md"
                    {...register("patientId", {
                      required: !patientId
                        ? "Patient selection is required"
                        : false,
                    })}
                  >
                    <option value="">Select a patient</option>
                    {patients.map((patient) => (
                      <option key={patient._id} value={patient._id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                  {errors.patientId && (
                    <p className="text-sm text-red-500">
                      {errors.patientId.message}
                    </p>
                  )}
                </div>
              )}
              {patientId && (
                <div className="space-y-2">
                  <Label>Selected Patient</Label>
                  <Input value={patientId} disabled className="bg-gray-50" />
                  <p className="text-sm text-muted-foreground">
                    Creating plan for selected patient
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Plan Description</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("description", {
                    required: "Description is required",
                  })}
                  placeholder="Provide an overview of this exercise plan and its goals"
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="goals">Treatment Goals</Label>
                <textarea
                  id="goals"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("goals", {
                    required: "Treatment goals are required",
                  })}
                  placeholder="e.g., Improve knee flexibility, Reduce pain, Strengthen quadriceps"
                />
                {errors.goals && (
                  <p className="text-sm text-red-500">{errors.goals.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Enter the main goals for this treatment plan
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exercises</CardTitle>
              <CardDescription>Add exercises to this plan</CardDescription>
            </CardHeader>
            <CardContent>
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 mb-8 border rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Exercise {index + 1}</h3>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Exercise Name</Label>
                      <Input
                        {...register(`exercises.${index}.name`, {
                          required: "Exercise name is required",
                        })}
                        placeholder="e.g., Knee Extensions"
                      />
                      {errors.exercises?.[index]?.name && (
                        <p className="text-sm text-red-500">
                          {errors.exercises[index].name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Sets</Label>
                      <Input
                        type="number"
                        {...register(`exercises.${index}.sets`, {
                          required: "Required",
                          valueAsNumber: true,
                          min: { value: 1, message: "Min 1" },
                        })}
                      />
                      {errors.exercises?.[index]?.sets && (
                        <p className="text-sm text-red-500">
                          {errors.exercises[index].sets.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Reps</Label>
                      <Input
                        type="number"
                        {...register(`exercises.${index}.reps`, {
                          required: "Required",
                          valueAsNumber: true,
                          min: { value: 1, message: "Min 1" },
                        })}
                      />
                      {errors.exercises?.[index]?.reps && (
                        <p className="text-sm text-red-500">
                          {errors.exercises[index].reps.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <select
                        className="w-full p-2 border rounded-md"
                        {...register(`exercises.${index}.frequency`, {
                          required: "Frequency is required",
                        })}
                      >
                        <option value="daily">Daily</option>
                        <option value="every-other-day">Every Other Day</option>
                        <option value="3-times-week">3 Times per Week</option>
                        <option value="weekly">Weekly</option>
                      </select>
                      {errors.exercises?.[index]?.frequency && (
                        <p className="text-sm text-red-500">
                          {errors.exercises[index].frequency.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Video Link (Optional)</Label>
                      <Input
                        {...register(`exercises.${index}.videoLink`)}
                        placeholder="e.g., https://youtube.com/watch?v=example"
                      />
                    </div>
                  </div>

                  <div className="mb-4 space-y-2">
                    <Label>Instructions</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...register(`exercises.${index}.instructions`, {
                        required: "Instructions are required",
                      })}
                      placeholder="Detailed instructions for performing this exercise"
                    />
                    {errors.exercises?.[index]?.instructions && (
                      <p className="text-sm text-red-500">
                        {errors.exercises[index].instructions.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addExercise}
                className="w-full mt-4"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Another Exercise
              </Button>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                type="submit"
                disabled={saving}
                className="w-full md:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Exercise Plan"}
              </Button>
              
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
