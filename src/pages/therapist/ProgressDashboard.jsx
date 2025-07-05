import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  BarChart3,
  Clock,
  AlertTriangle,
  FileText,
  Heart,
  Zap,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import api from "../../services/api";
import { useAuth } from "../../lib/AuthContext";

export default function ProgressDashboard() {
  const { patientId } = useParams();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [progressStats, setProgressStats] = useState(null);

  useEffect(() => {
    fetchProgressData();
  }, [patientId]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);

      // Fetch patient profile
      const patientResponse = await api.get(`/patients/${patientId}/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (patientResponse.data.success) {
        setPatient(patientResponse.data.data);
      }

      // Fetch treatment plans
      const plansResponse = await api.get(
        `/treatment-plans/patient/${patientId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (plansResponse.data.success) {
        setTreatmentPlans(plansResponse.data.data);
        if (plansResponse.data.data.length > 0) {
          setSelectedPlan(plansResponse.data.data[0]);
        }
      }

      // Fetch all progress records for the patient
      const progressResponse = await api.get(`/progress/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (progressResponse.data.success) {
        setProgressData(progressResponse.data.data);
      }

      // Fetch progress statistics
      if (plansResponse.data.success && plansResponse.data.data.length > 0) {
        const statsResponse = await api.get(
          `/progress/stats/${plansResponse.data.data[0]._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (statsResponse.data.success) {
          setProgressStats(statsResponse.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgressTrend = (data, metric) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-2);
    if (metric === "painLevel") {
      // For pain, lower is better, so invert the trend
      return recent[0][metric] - recent[1][metric];
    }
    return recent[1][metric] - recent[0][metric];
  };

  const getProgressIcon = (trend) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Activity className="h-4 w-4 text-blue-400" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/therapist/progress-overview">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Overview
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
                Progress Dashboard
              </h1>
              <p className="text-slate-300 mt-2">
                {patient?.firstName && patient?.lastName
                  ? `${patient.firstName} ${patient.lastName}`
                  : patient?.name || "Patient"}{" "}
                • Treatment Progress Tracking
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {progressData.length} Records
            </Badge>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-sm border-red-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-red-200">
                  Latest Pain Level
                </CardTitle>
                <div className="p-2 rounded-full bg-red-500/20">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {progressData.length > 0 ? progressData[0].painLevel : "N/A"}
                  /10
                </div>
                <div className="flex items-center text-xs text-red-300 mt-1">
                  {progressData.length > 1 &&
                    getProgressIcon(
                      calculateProgressTrend(progressData, "painLevel")
                    )}
                  <span className="ml-1">
                    {progressData.length > 1
                      ? `${
                          calculateProgressTrend(progressData, "painLevel") > 0
                            ? "Improved"
                            : "Increased"
                        }`
                      : "No trend data"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">
                  Mobility Score
                </CardTitle>
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Zap className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {progressData.length > 0 ? progressData[0].mobility : "N/A"}/5
                </div>
                <div className="flex items-center text-xs text-blue-300 mt-1">
                  {progressData.length > 1 &&
                    getProgressIcon(
                      calculateProgressTrend(progressData, "mobility")
                    )}
                  <span className="ml-1">
                    {progressData.length > 1
                      ? `${
                          calculateProgressTrend(progressData, "mobility") > 0
                            ? "Improved"
                            : "Declined"
                        }`
                      : "No trend data"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-200">
                  Strength Level
                </CardTitle>
                <div className="p-2 rounded-full bg-green-500/20">
                  <Heart className="h-4 w-4 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {progressData.length > 0 ? progressData[0].strength : "N/A"}/5
                </div>
                <div className="flex items-center text-xs text-green-300 mt-1">
                  {progressData.length > 1 &&
                    getProgressIcon(
                      calculateProgressTrend(progressData, "strength")
                    )}
                  <span className="ml-1">
                    {progressData.length > 1
                      ? `${
                          calculateProgressTrend(progressData, "strength") > 0
                            ? "Improved"
                            : "Declined"
                        }`
                      : "No trend data"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">
                  Total Entries
                </CardTitle>
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Target className="h-4 w-4 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {progressData.length}
                </div>
                <p className="text-xs text-purple-300">Progress records</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList className="bg-slate-800/60 border border-slate-700/50">
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <Clock className="h-4 w-4 mr-2" />
                Progress Timeline
              </TabsTrigger>
              <TabsTrigger
                value="plans"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Treatment Plans
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <Card className="border-0 bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Progress Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressData.length > 0 ? (
                      progressData.map((entry, index) => (
                        <motion.div
                          key={entry._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="p-4 rounded-lg border border-slate-600/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-white">
                              Progress Update
                            </h4>
                            <span className="text-sm text-slate-300">
                              {formatDate(entry.createdAt)}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div className="text-center">
                              <div className="text-xs text-slate-400">
                                Pain Level
                              </div>
                              <div
                                className={`text-lg font-bold ${getPainLevelColor(
                                  entry.painLevel
                                )}`}
                              >
                                {entry.painLevel}/10
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-400">
                                Mobility
                              </div>
                              <div
                                className={`text-lg font-bold ${getScoreColor(
                                  entry.mobility,
                                  5
                                )}`}
                              >
                                {entry.mobility}/5
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-slate-400">
                                Strength
                              </div>
                              <div
                                className={`text-lg font-bold ${getScoreColor(
                                  entry.strength,
                                  5
                                )}`}
                              >
                                {entry.strength}/5
                              </div>
                            </div>
                          </div>

                          {entry.notes && (
                            <div className="bg-slate-800/50 p-3 rounded border border-slate-600/30 mb-3">
                              <p className="text-sm text-slate-300">
                                {entry.notes}
                              </p>
                            </div>
                          )}

                          {entry.mediaUrl && (
                            <div className="mt-3">
                              {entry.mediaType === "image" ? (
                                <img
                                  src={entry.mediaUrl}
                                  alt="Progress media"
                                  className="max-w-xs rounded border border-slate-600/30"
                                />
                              ) : (
                                <video
                                  src={entry.mediaUrl}
                                  controls
                                  className="max-w-xs rounded border border-slate-600/30"
                                />
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Target className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-300">
                          No Progress Records
                        </h3>
                        <p className="text-slate-400">
                          This patient hasn't recorded any progress yet.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plans">
              <Card className="border-0 bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Treatment Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {treatmentPlans.length > 0 ? (
                      treatmentPlans.map((plan, index) => (
                        <motion.div
                          key={plan._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="p-4 rounded-lg border border-slate-600/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-white">
                              {plan.title}
                            </h3>
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {plan.status || "Active"}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300 mb-3">
                            {plan.description}
                          </p>
                          {plan.exercises && (
                            <div>
                              <p className="text-xs text-slate-400 mb-2">
                                Exercises ({plan.exercises.length}):
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {plan.exercises
                                  .slice(0, 4)
                                  .map((exercise, idx) => (
                                    <div
                                      key={idx}
                                      className="text-xs text-slate-300 bg-slate-700/30 p-2 rounded"
                                    >
                                      Exercise {idx + 1}: {exercise.sets} sets ×{" "}
                                      {exercise.reps} reps
                                    </div>
                                  ))}
                                {plan.exercises.length > 4 && (
                                  <div className="text-xs text-slate-400 p-2">
                                    +{plan.exercises.length - 4} more exercises
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-300">
                          No Treatment Plans
                        </h3>
                        <p className="text-slate-400">
                          No treatment plans found for this patient.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights">
              <Card className="border-0 bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Progress Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {progressStats ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">
                            {progressStats.avgMobility}
                          </div>
                          <div className="text-sm text-slate-400">
                            Average Mobility
                          </div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">
                            {progressStats.avgStrength}
                          </div>
                          <div className="text-sm text-slate-400">
                            Average Strength
                          </div>
                        </div>
                        <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                          <div className="text-2xl font-bold text-red-400">
                            {progressStats.avgPainLevel}
                          </div>
                          <div className="text-sm text-slate-400">
                            Average Pain Level
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 p-4 rounded-lg">
                        <h4 className="font-semibold text-white mb-3">
                          Progress Trends
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            {getProgressIcon(
                              progressStats.progressTrend.painLevel
                            )}
                            <span className="text-sm text-slate-300">
                              Pain:{" "}
                              {progressStats.progressTrend.painLevel > 0
                                ? "Improving"
                                : "Stable"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getProgressIcon(
                              progressStats.progressTrend.mobility
                            )}
                            <span className="text-sm text-slate-300">
                              Mobility:{" "}
                              {progressStats.progressTrend.mobility > 0
                                ? "Improving"
                                : "Stable"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getProgressIcon(
                              progressStats.progressTrend.strength
                            )}
                            <span className="text-sm text-slate-300">
                              Strength:{" "}
                              {progressStats.progressTrend.strength > 0
                                ? "Improving"
                                : "Stable"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-300">
                        No Data Available
                      </h3>
                      <p className="text-slate-400">
                        Not enough progress data to generate insights.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
