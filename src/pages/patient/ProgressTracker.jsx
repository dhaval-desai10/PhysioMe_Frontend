import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  TrendingUp,
  Camera,
  Upload,
  Save,
  Target,
  Heart,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Play,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Slider } from "../../components/ui/slider";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function ProgressTracker() {
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [progressEntries, setProgressEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    treatmentPlanId: "",
    painLevel: [5],
    mobility: [3],
    strength: [3],
    notes: "",
    mediaFile: null,
  });

  useEffect(() => {
    fetchTreatmentPlans();
    fetchProgressEntries();
  }, []);

  const fetchTreatmentPlans = async () => {
    try {
      const response = await api.get("/treatment-plans/patient", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        setTreatmentPlans(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedPlan(response.data.data[0]);
          setFormData((prev) => ({
            ...prev,
            treatmentPlanId: response.data.data[0]._id,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching treatment plans:", error);
      toast.error("Failed to load treatment plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressEntries = async () => {
    try {
      const response = await api.get("/progress", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        setProgressEntries(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching progress entries:", error);
      toast.error("Failed to load progress history");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.treatmentPlanId) {
      toast.error("Please select a treatment plan");
      return;
    }

    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("treatmentPlanId", formData.treatmentPlanId);
      submitData.append("painLevel", formData.painLevel[0]);
      submitData.append("mobility", formData.mobility[0]);
      submitData.append("strength", formData.strength[0]);
      submitData.append("notes", formData.notes);

      if (formData.mediaFile) {
        submitData.append("media", formData.mediaFile);
      }

      const response = await api.post("/progress", submitData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Progress recorded successfully!");
        setFormData({
          treatmentPlanId: formData.treatmentPlanId,
          painLevel: [5],
          mobility: [3],
          strength: [3],
          notes: "",
          mediaFile: null,
        });
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";

        fetchProgressEntries();
      }
    } catch (error) {
      console.error("Error submitting progress:", error);
      toast.error("Failed to record progress");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, mediaFile: file }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPainLevelColor = (level) => {
    if (level <= 3) return "text-green-400";
    if (level <= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreColor = (score, max) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-blue-400";
    if (percentage >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressBadge = (painLevel, mobility, strength) => {
    const avgScore = (5 - painLevel / 2 + mobility + strength) / 3;
    if (avgScore >= 4)
      return {
        text: "Excellent",
        class: "bg-green-500/20 text-green-400 border-green-500/30",
      };
    if (avgScore >= 3)
      return {
        text: "Good",
        class: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      };
    if (avgScore >= 2)
      return {
        text: "Fair",
        class: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      };
    return {
      text: "Needs Attention",
      class: "bg-red-500/20 text-red-400 border-red-500/30",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
            Progress Tracker
          </h1>
          <p className="text-slate-300 mt-2">
            Track your recovery journey and share updates with your therapist
          </p>
        </div>

        <Tabs defaultValue="record" className="space-y-6">
          <TabsList className="bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm">
            <TabsTrigger
              value="record"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              Record Progress
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="record">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Progress Form */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-400" />
                      Record Your Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Treatment Plan Selection */}
                      {treatmentPlans.length > 0 && (
                        <div>
                          <Label className="text-slate-200">
                            Treatment Plan
                          </Label>
                          <select
                            value={formData.treatmentPlanId}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                treatmentPlanId: e.target.value,
                              }));
                              const plan = treatmentPlans.find(
                                (p) => p._id === e.target.value
                              );
                              setSelectedPlan(plan);
                            }}
                            className="w-full mt-1 p-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          >
                            {treatmentPlans.map((plan) => (
                              <option key={plan._id} value={plan._id}>
                                {plan.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Pain Level */}
                      <div>
                        <Label className="text-slate-200 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                          Pain Level:{" "}
                          <span
                            className={`ml-2 font-bold ${getPainLevelColor(
                              formData.painLevel[0]
                            )}`}
                          >
                            {formData.painLevel[0]}/10
                          </span>
                        </Label>
                        <div className="mt-3">
                          <Slider
                            value={formData.painLevel}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                painLevel: value,
                              }))
                            }
                            max={10}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>No Pain</span>
                            <span>Severe Pain</span>
                          </div>
                        </div>
                      </div>

                      {/* Mobility Score */}
                      <div>
                        <Label className="text-slate-200 flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-blue-400" />
                          Mobility:{" "}
                          <span
                            className={`ml-2 font-bold ${getScoreColor(
                              formData.mobility[0],
                              5
                            )}`}
                          >
                            {formData.mobility[0]}/5
                          </span>
                        </Label>
                        <div className="mt-3">
                          <Slider
                            value={formData.mobility}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                mobility: value,
                              }))
                            }
                            max={5}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>Very Limited</span>
                            <span>Excellent</span>
                          </div>
                        </div>
                      </div>

                      {/* Strength Score */}
                      <div>
                        <Label className="text-slate-200 flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-purple-400" />
                          Strength:{" "}
                          <span
                            className={`ml-2 font-bold ${getScoreColor(
                              formData.strength[0],
                              5
                            )}`}
                          >
                            {formData.strength[0]}/5
                          </span>
                        </Label>
                        <div className="mt-3">
                          <Slider
                            value={formData.strength}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                strength: value,
                              }))
                            }
                            max={5}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>Very Weak</span>
                            <span>Very Strong</span>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <Label className="text-slate-200 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-green-400" />
                          Notes
                        </Label>
                        <Textarea
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              notes: e.target.value,
                            }))
                          }
                          placeholder="How are you feeling? Any changes or concerns?"
                          className="mt-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          rows={4}
                        />
                      </div>

                      {/* Media Upload */}
                      <div>
                        <Label className="text-slate-200 flex items-center">
                          <Camera className="h-4 w-4 mr-2 text-teal-400" />
                          Photo/Video (Optional)
                        </Label>
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          className="mt-1 bg-slate-700/50 border-slate-600 text-white file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:border-0 file:text-white file:rounded-md file:px-4 file:py-2 file:mr-4 hover:bg-slate-700/70 transition-all"
                        />
                        {formData.mediaFile && (
                          <p className="text-sm text-blue-400 mt-2">
                            Selected: {formData.mediaFile.name}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Upload className="h-4 w-4 mr-2 animate-spin" />
                            Recording...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Record Progress
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Current Plan Info */}
              <div>
                {selectedPlan && (
                  <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Target className="h-5 w-5 mr-2 text-blue-400" />
                        Current Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-white text-lg">
                          {selectedPlan.title}
                        </h3>
                        <p className="text-sm text-slate-300">
                          {selectedPlan.description}
                        </p>

                        <div className="flex items-center space-x-2">
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {selectedPlan.status}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {selectedPlan.duration || "Ongoing"}
                          </span>
                        </div>

                        {selectedPlan.exercises &&
                          selectedPlan.exercises.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm text-slate-400 mb-3 font-medium">
                                Exercises ({selectedPlan.exercises.length}):
                              </p>
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {selectedPlan.exercises
                                  .slice(0, 4)
                                  .map((exercise, index) => (
                                    <div
                                      key={index}
                                      className="text-sm text-slate-300 bg-slate-700/30 p-3 rounded-lg border border-slate-600/30"
                                    >
                                      <div className="font-medium">
                                        {exercise.name ||
                                          `Exercise ${index + 1}`}
                                      </div>
                                      {exercise.sets && exercise.reps && (
                                        <div className="text-xs text-slate-400 mt-1">
                                          {exercise.sets} sets × {exercise.reps}{" "}
                                          reps
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                {selectedPlan.exercises.length > 4 && (
                                  <div className="text-xs text-slate-400 text-center py-2">
                                    +{selectedPlan.exercises.length - 4} more
                                    exercises
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Today's Preview */}
                <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 shadow-xl mt-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-green-400" />
                      Today's Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-xs text-slate-400">Pain</div>
                        <div
                          className={`text-lg font-bold ${getPainLevelColor(
                            formData.painLevel[0]
                          )}`}
                        >
                          {formData.painLevel[0]}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Mobility</div>
                        <div
                          className={`text-lg font-bold ${getScoreColor(
                            formData.mobility[0],
                            5
                          )}`}
                        >
                          {formData.mobility[0]}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Strength</div>
                        <div
                          className={`text-lg font-bold ${getScoreColor(
                            formData.strength[0],
                            5
                          )}`}
                        >
                          {formData.strength[0]}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge
                        className={
                          getProgressBadge(
                            formData.painLevel[0],
                            formData.mobility[0],
                            formData.strength[0]
                          ).class
                        }
                      >
                        {
                          getProgressBadge(
                            formData.painLevel[0],
                            formData.mobility[0],
                            formData.strength[0]
                          ).text
                        }
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                  Progress History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressEntries.length > 0 ? (
                    progressEntries.map((entry, index) => (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-4 rounded-lg border border-slate-600/50 bg-gradient-to-r from-slate-700/30 to-slate-700/10 backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                              <CheckCircle className="h-5 w-5 text-blue-400" />
                            </div>
                            <h4 className="font-semibold text-white">
                              Progress Update
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-slate-300">
                              {formatDate(entry.createdAt)}
                            </span>
                            <div className="mt-1">
                              <Badge
                                className={
                                  getProgressBadge(
                                    entry.painLevel,
                                    entry.mobility,
                                    entry.strength
                                  ).class
                                }
                              >
                                {
                                  getProgressBadge(
                                    entry.painLevel,
                                    entry.mobility,
                                    entry.strength
                                  ).text
                                }
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-red-500/20">
                            <div className="text-xs text-red-200 mb-1">
                              Pain Level
                            </div>
                            <div
                              className={`text-xl font-bold ${getPainLevelColor(
                                entry.painLevel
                              )}`}
                            >
                              {entry.painLevel}/10
                            </div>
                          </div>
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-blue-500/20">
                            <div className="text-xs text-blue-200 mb-1">
                              Mobility
                            </div>
                            <div
                              className={`text-xl font-bold ${getScoreColor(
                                entry.mobility,
                                5
                              )}`}
                            >
                              {entry.mobility}/5
                            </div>
                          </div>
                          <div className="text-center p-3 bg-slate-800/50 rounded-lg border border-purple-500/20">
                            <div className="text-xs text-purple-200 mb-1">
                              Strength
                            </div>
                            <div
                              className={`text-xl font-bold ${getScoreColor(
                                entry.strength,
                                5
                              )}`}
                            >
                              {entry.strength}/5
                            </div>
                          </div>
                        </div>

                        {entry.notes && (
                          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600/30 mb-3">
                            <div className="flex items-center mb-2">
                              <FileText className="h-4 w-4 text-green-400 mr-2" />
                              <span className="text-sm text-green-200 font-medium">
                                Notes
                              </span>
                            </div>
                            <p className="text-sm text-slate-300">
                              {entry.notes}
                            </p>
                          </div>
                        )}

                        {entry.mediaUrl && (
                          <div className="mt-3">
                            <div className="flex items-center mb-2">
                              {entry.mediaType === "video" ? (
                                <Play className="h-4 w-4 text-teal-400 mr-2" />
                              ) : (
                                <ImageIcon className="h-4 w-4 text-teal-400 mr-2" />
                              )}
                              <span className="text-sm text-teal-200 font-medium">
                                Media
                              </span>
                            </div>
                            {entry.mediaType === "image" ? (
                              <img
                                src={entry.mediaUrl}
                                alt="Progress media"
                                className="max-w-xs rounded-lg border border-slate-600/30 shadow-lg"
                              />
                            ) : (
                              <video
                                src={entry.mediaUrl}
                                controls
                                className="max-w-xs rounded-lg border border-slate-600/30 shadow-lg"
                              />
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                        <TrendingUp className="h-8 w-8 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-300 mb-2">
                        No Progress Records Yet
                      </h3>
                      <p className="text-slate-400">
                        Start tracking your recovery by recording your first
                        progress update.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
