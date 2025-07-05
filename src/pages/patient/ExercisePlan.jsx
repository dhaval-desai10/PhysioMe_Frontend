import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Checkbox } from "../../components/ui/checkbox";
import { toast } from "react-hot-toast";
import {
  CheckCircle2,
  PlayCircle,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import api from "../../services/api";

export default function PatientExercisePlan() {
  const { planId } = useParams();
  const { user } = useAuth();
  const [exercisePlan, setExercisePlan] = useState(null);
  const [completedExercises, setCompletedExercises] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("plan");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchExercisePlan();
    // Load any saved progress from localStorage
    const savedProgress = localStorage.getItem(
      `exercisePlan_${planId}_progress`
    );
    if (savedProgress) {
      setCompletedExercises(JSON.parse(savedProgress));
    }
  }, [planId]);

  useEffect(() => {
    // Calculate progress whenever completedExercises changes
    if (exercisePlan) {
      const totalExercises = exercisePlan.exercises.length;
      const completedCount =
        Object.values(completedExercises).filter(Boolean).length;
      setProgress(Math.round((completedCount / totalExercises) * 100));
    }
  }, [completedExercises, exercisePlan]);

  const fetchExercisePlan = async () => {
    setLoading(true);
    try {
      if (!planId) {
        // If no planId, fetch the first available treatment plan for this patient
        const response = await api.get("/treatment-plans", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success && response.data.data.length > 0) {
          setExercisePlan(transformTreatmentPlan(response.data.data[0]));
        } else {
          setExercisePlan(null);
        }
      } else {
        // Fetch specific treatment plan by ID
        const response = await api.get(`/treatment-plans/${planId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setExercisePlan(transformTreatmentPlan(response.data.data));
        } else {
          setExercisePlan(null);
        }
      }
    } catch (error) {
      console.error("Error fetching exercise plan:", error);
      toast.error("Failed to load exercise plan");
      setExercisePlan(null);
    } finally {
      setLoading(false);
    }
  };

  const transformTreatmentPlan = (plan) => {
    return {
      _id: plan._id,
      title: plan.title,
      description: plan.description,
      therapist: {
        _id: plan.physiotherapistId._id,
        name: plan.physiotherapistId.name,
        specialization: "Physiotherapist",
      },
      createdAt: plan.createdAt,
      exercises: plan.exercises.map((ex) => ({
        _id: ex.exerciseId._id,
        name: ex.exerciseId.name,
        sets: ex.sets,
        reps: ex.reps,
        instructions: ex.notes || ex.exerciseId.description,
        videoLink: ex.exerciseId.mediaUrl || "",
        frequency: ex.frequency,
      })),
    };
  };

  const toggleExerciseCompletion = (exerciseId) => {
    const updatedCompletions = {
      ...completedExercises,
      [exerciseId]: !completedExercises[exerciseId],
    };
    setCompletedExercises(updatedCompletions);

    // Save progress to localStorage
    localStorage.setItem(
      `exercisePlan_${planId}_progress`,
      JSON.stringify(updatedCompletions)
    );

    // Optionally, send to server for future implementation
    // api.post('/progress', { planId, exerciseId, completed: updatedCompletions[exerciseId] });
  };

  const logDailyProgress = async () => {
    try {
      // For future implementation with progress API
      // await api.post('/progress', { planId, completedExercises, date: new Date() });
      toast.success("Progress logged successfully!");

      // Reset completions after logging
      setCompletedExercises({});
      localStorage.removeItem(`exercisePlan_${planId}_progress`);
    } catch (error) {
      console.error("Error logging progress:", error);
      toast.error("Failed to log progress");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading exercise plan...</div>;
  }

  if (!exercisePlan) {
    return (
      <div className="p-8 text-center">
        <p className="mb-4">No exercise plan found.</p>
        <Link to="/patient/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Link to="/patient/dashboard" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{exercisePlan.title}</h1>
        </div>

        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <p className="text-muted-foreground mb-2">
                    Assigned by: {exercisePlan.therapist.name}
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Date:{" "}
                    {new Date(exercisePlan.createdAt).toLocaleDateString()}
                  </p>
                  <p>{exercisePlan.description}</p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-8 flex flex-col items-center">
                  <div className="relative h-24 w-24">
                    <svg className="h-24 w-24" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-primary"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 40 * (1 - progress / 100)
                        }`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{progress}%</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Today's Progress
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plan">Exercise Plan</TabsTrigger>
            <TabsTrigger value="progress">Track Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="plan" className="mt-6">
            <div className="space-y-6">
              {exercisePlan.exercises.map((exercise, index) => (
                <Card key={exercise._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      {exercise.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{exercise.sets} sets</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>{exercise.reps} reps</span>
                      </div>
                      {exercise.videoLink && (
                        <a
                          href={exercise.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          <PlayCircle className="h-5 w-5 mr-2" />
                          Watch Video
                        </a>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {exercise.instructions}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Track Today's Progress</CardTitle>
                <CardDescription>
                  Check off exercises as you complete them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exercisePlan.exercises.map((exercise) => (
                    <div
                      key={exercise._id}
                      className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50"
                    >
                      <Checkbox
                        id={`exercise-${exercise._id}`}
                        checked={!!completedExercises[exercise._id]}
                        onCheckedChange={() =>
                          toggleExerciseCompletion(exercise._id)
                        }
                      />
                      <label
                        htmlFor={`exercise-${exercise._id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {exercise.sets} sets × {exercise.reps} reps
                        </div>
                      </label>
                      {completedExercises[exercise._id] && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={logDailyProgress}
                  disabled={
                    Object.values(completedExercises).filter(Boolean).length ===
                    0
                  }
                  className="w-full"
                >
                  Log Today's Progress
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
