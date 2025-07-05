import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Target,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Eye,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import api from "../../services/api";
import { useAuth } from "../../lib/AuthContext";

export default function ProgressOverview() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    recentProgress: 0,
    improvementRate: 0,
  });

  useEffect(() => {
    fetchPatientsProgress();
  }, [user]);

  const fetchPatientsProgress = async () => {
    try {
      setLoading(true);

      // Fetch all patients for this therapist
      const patientsResponse = await api.get(
        `/therapist/${user._id}/patients`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (patientsResponse.data.success) {
        const patientsData = patientsResponse.data.data;

        // Fetch progress summary for each patient
        const patientsWithProgress = await Promise.all(
          patientsData.map(async (patient) => {
            try {
              const progressResponse = await api.get(
                `/progress/summary/${patient._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              return {
                ...patient,
                progressSummary: progressResponse.data.success
                  ? progressResponse.data.data
                  : null,
              };
            } catch (error) {
              return {
                ...patient,
                progressSummary: null,
              };
            }
          })
        );

        setPatients(patientsWithProgress);

        // Calculate overall stats
        const totalPatients = patientsWithProgress.length;
        const activePatients = patientsWithProgress.filter(
          (p) => p.progressSummary && p.progressSummary.totalProgressEntries > 0
        ).length;
        const recentProgress = patientsWithProgress.reduce(
          (sum, p) =>
            sum +
            (p.progressSummary ? p.progressSummary.totalProgressEntries : 0),
          0
        );

        setStats({
          totalPatients,
          activePatients,
          recentProgress,
          improvementRate:
            activePatients > 0
              ? Math.round((activePatients / totalPatients) * 100)
              : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching patients progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressTrend = (summary) => {
    if (!summary || !summary.trends) return null;

    const painTrend = summary.trends.painLevel;
    const mobilityTrend = summary.trends.mobility;
    const strengthTrend = summary.trends.strength;

    if (painTrend.length < 2) return null;

    const recentPain =
      painTrend.slice(-3).reduce((sum, p) => sum + p.value, 0) /
      Math.min(3, painTrend.length);
    const previousPain =
      painTrend.slice(-6, -3).reduce((sum, p) => sum + p.value, 0) /
      Math.min(3, painTrend.slice(-6, -3).length);

    const painImprovement = previousPain - recentPain; // Lower pain is better
    const mobilityImprovement =
      mobilityTrend.length >= 6
        ? mobilityTrend.slice(-3).reduce((sum, p) => sum + p.value, 0) / 3 -
          mobilityTrend.slice(-6, -3).reduce((sum, p) => sum + p.value, 0) / 3
        : 0;

    const overallImprovement = (painImprovement + mobilityImprovement) / 2;

    return overallImprovement;
  };

  const getTrendIcon = (trend) => {
    if (trend === null) return <Activity className="h-4 w-4 text-slate-400" />;
    if (trend > 0.5) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (trend < -0.5) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Activity className="h-4 w-4 text-blue-400" />;
  };

  const getTrendColor = (trend) => {
    if (trend === null) return "text-slate-400";
    if (trend > 0.5) return "text-green-400";
    if (trend < -0.5) return "text-red-400";
    return "text-blue-400";
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
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
            Patient Progress Overview
          </h1>
          <p className="text-slate-300 mt-2">
            Monitor your patients' recovery progress and outcomes
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-200">
                  Total Patients
                </CardTitle>
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Users className="h-4 w-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.totalPatients}
                </div>
                <p className="text-xs text-blue-300">Under your care</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-green-200">
                  Active Patients
                </CardTitle>
                <div className="p-2 rounded-full bg-green-500/20">
                  <Activity className="h-4 w-4 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.activePatients}
                </div>
                <p className="text-xs text-green-300">Recording progress</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-200">
                  Progress Entries
                </CardTitle>
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Target className="h-4 w-4 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.recentProgress}
                </div>
                <p className="text-xs text-purple-300">Total recorded</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 backdrop-blur-sm border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-orange-200">
                  Engagement Rate
                </CardTitle>
                <div className="p-2 rounded-full bg-orange-500/20">
                  <CheckCircle2 className="h-4 w-4 text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {stats.improvementRate}%
                </div>
                <p className="text-xs text-orange-300">Active participation</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Patients Progress Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                Patient Progress Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.length > 0 ? (
                  patients.map((patient, index) => {
                    const trend = getProgressTrend(patient.progressSummary);
                    const hasProgress =
                      patient.progressSummary &&
                      patient.progressSummary.totalProgressEntries > 0;

                    return (
                      <motion.div
                        key={patient._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="p-4 rounded-lg border border-white/10 bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-slate-700/50 hover:to-slate-600/50 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
                              <span className="text-lg font-bold text-blue-400">
                                {patient.firstName?.charAt(0) ||
                                  patient.name?.charAt(0) ||
                                  "P"}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">
                                {patient.firstName && patient.lastName
                                  ? `${patient.firstName} ${patient.lastName}`
                                  : patient.name || "Unknown Patient"}
                              </h3>
                              <div className="flex items-center space-x-3 mt-1">
                                <Badge
                                  className={`${
                                    hasProgress
                                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  }`}
                                >
                                  {hasProgress ? "Active" : "Inactive"}
                                </Badge>
                                {hasProgress && (
                                  <div className="flex items-center space-x-1">
                                    {getTrendIcon(trend)}
                                    <span
                                      className={`text-xs ${getTrendColor(
                                        trend
                                      )}`}
                                    >
                                      {trend > 0.5
                                        ? "Improving"
                                        : trend < -0.5
                                        ? "Needs Attention"
                                        : "Stable"}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            {hasProgress && (
                              <div className="text-right">
                                <div className="text-sm font-medium text-white">
                                  {patient.progressSummary.totalProgressEntries}{" "}
                                  entries
                                </div>
                                <div className="text-xs text-slate-300">
                                  {patient.progressSummary.totalTreatmentPlans}{" "}
                                  treatment plans
                                </div>
                              </div>
                            )}

                            <Link to={`/therapist/progress/${patient._id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-blue-500/30 text-blue-400 hover:from-blue-600/20 hover:to-purple-600/20"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Progress
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {hasProgress &&
                          patient.progressSummary.recentProgress.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                              <div className="text-xs text-slate-400 mb-2">
                                Latest Update:
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                  <div className="text-xs text-slate-400">
                                    Pain
                                  </div>
                                  <div className="text-sm font-medium text-white">
                                    {
                                      patient.progressSummary.recentProgress[0]
                                        .painLevel
                                    }
                                    /10
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-slate-400">
                                    Mobility
                                  </div>
                                  <div className="text-sm font-medium text-white">
                                    {
                                      patient.progressSummary.recentProgress[0]
                                        .mobility
                                    }
                                    /5
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-slate-400">
                                    Strength
                                  </div>
                                  <div className="text-sm font-medium text-white">
                                    {
                                      patient.progressSummary.recentProgress[0]
                                        .strength
                                    }
                                    /5
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-300">
                      No Patients Found
                    </h3>
                    <p className="text-slate-400">
                      You don't have any patients assigned yet.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
