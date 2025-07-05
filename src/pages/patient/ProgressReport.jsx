import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  LineChart as LineChartIcon,
  Target,
  Calendar,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import api from "../../services/api";
import { toast } from "react-hot-toast";

const PAIN_COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];
const PROGRESS_COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981"];

export default function ProgressReport() {
  const [treatmentPlans, setTreatmentPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreatmentPlans();
    fetchProgressData();
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
        }
      }
    } catch (error) {
      console.error("Error fetching treatment plans:", error);
      toast.error("Failed to load treatment plans");
    }
  };

  const fetchProgressData = async () => {
    try {
      const response = await api.get("/progress", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        setProgressData(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats(null);
      return;
    }

    const sortedData = data.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Calculate averages
    const avgPain =
      data.reduce((sum, entry) => sum + entry.painLevel, 0) / data.length;
    const avgMobility =
      data.reduce((sum, entry) => sum + entry.mobility, 0) / data.length;
    const avgStrength =
      data.reduce((sum, entry) => sum + entry.strength, 0) / data.length;

    // Calculate trends (compare first and last entry)
    const first = sortedData[0];
    const last = sortedData[sortedData.length - 1];

    const painTrend = first.painLevel - last.painLevel; // Positive means pain decreased (good)
    const mobilityTrend = last.mobility - first.mobility; // Positive means mobility increased (good)
    const strengthTrend = last.strength - first.strength; // Positive means strength increased (good)

    setStats({
      totalEntries: data.length,
      averages: {
        pain: avgPain.toFixed(1),
        mobility: avgMobility.toFixed(1),
        strength: avgStrength.toFixed(1),
      },
      trends: {
        pain: painTrend.toFixed(1),
        mobility: mobilityTrend.toFixed(1),
        strength: strengthTrend.toFixed(1),
      },
      chartData: sortedData.map((entry, index) => ({
        session: index + 1,
        date: new Date(entry.createdAt).toLocaleDateString(),
        painLevel: entry.painLevel,
        mobility: entry.mobility,
        strength: entry.strength,
        overall:
          (5 - entry.painLevel / 2 + entry.mobility + entry.strength) / 3,
      })),
    });
  };

  const getTrendIcon = (trend, isReversed = false) => {
    const value = parseFloat(trend);
    const isPositive = isReversed ? value < 0 : value > 0;

    if (Math.abs(value) < 0.1)
      return <Activity className="h-4 w-4 text-blue-400" />;
    return isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-400" />
    );
  };

  const getTrendColor = (trend, isReversed = false) => {
    const value = parseFloat(trend);
    const isPositive = isReversed ? value < 0 : value > 0;

    if (Math.abs(value) < 0.1) return "text-blue-400";
    return isPositive ? "text-green-400" : "text-red-400";
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
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
            Progress Report
          </h1>
          <p className="text-slate-300 mt-2">
            Analyze your recovery progress and trends over time
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border-blue-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-200">
                    Total Sessions
                  </CardTitle>
                  <div className="p-2 rounded-full bg-blue-500/20">
                    <Calendar className="h-4 w-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats.totalEntries}
                  </div>
                  <p className="text-xs text-blue-300">
                    Progress entries recorded
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="border-0 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-sm border-red-500/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-red-200">
                    Pain Level Trend
                  </CardTitle>
                  <div className="p-2 rounded-full bg-red-500/20">
                    {getTrendIcon(stats.trends.pain, true)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats.averages.pain}/10
                  </div>
                  <p
                    className={`text-xs ${getTrendColor(
                      stats.trends.pain,
                      true
                    )}`}
                  >
                    {stats.trends.pain > 0
                      ? "Decreased by"
                      : stats.trends.pain < 0
                      ? "Increased by"
                      : "No change"}{" "}
                    {Math.abs(stats.trends.pain)}
                  </p>
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
                    Mobility Progress
                  </CardTitle>
                  <div className="p-2 rounded-full bg-green-500/20">
                    {getTrendIcon(stats.trends.mobility)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats.averages.mobility}/5
                  </div>
                  <p
                    className={`text-xs ${getTrendColor(
                      stats.trends.mobility
                    )}`}
                  >
                    {stats.trends.mobility > 0
                      ? "Improved by"
                      : stats.trends.mobility < 0
                      ? "Decreased by"
                      : "No change"}{" "}
                    {Math.abs(stats.trends.mobility)}
                  </p>
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
                    Strength Progress
                  </CardTitle>
                  <div className="p-2 rounded-full bg-purple-500/20">
                    {getTrendIcon(stats.trends.strength)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {stats.averages.strength}/5
                  </div>
                  <p
                    className={`text-xs ${getTrendColor(
                      stats.trends.strength
                    )}`}
                  >
                    {stats.trends.strength > 0
                      ? "Improved by"
                      : stats.trends.strength < 0
                      ? "Decreased by"
                      : "No change"}{" "}
                    {Math.abs(stats.trends.strength)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Charts */}
        {stats && stats.chartData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Trends Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2 text-blue-400" />
                    Progress Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="session"
                        stroke="#94a3b8"
                        tick={{ fill: "#94a3b8" }}
                      />
                      <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="painLevel"
                        stroke="#ef4444"
                        strokeWidth={2}
                        name="Pain Level"
                        dot={{ fill: "#ef4444", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="mobility"
                        stroke="#22c55e"
                        strokeWidth={2}
                        name="Mobility"
                        dot={{ fill: "#22c55e", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="strength"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Strength"
                        dot={{ fill: "#8b5cf6", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Overall Progress Area Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                    Overall Progress Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="session"
                        stroke="#94a3b8"
                        tick={{ fill: "#94a3b8" }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        tick={{ fill: "#94a3b8" }}
                        domain={[0, 5]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="overall"
                        stroke="#3b82f6"
                        fill="url(#progressGradient)"
                        strokeWidth={2}
                        name="Overall Score"
                      />
                      <defs>
                        <linearGradient
                          id="progressGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekly Progress Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="h-5 w-5 mr-2 text-teal-400" />
                    Session Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stats.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1e293b",
                          border: "1px solid #475569",
                          borderRadius: "8px",
                          color: "#f1f5f9",
                        }}
                      />
                      <Bar
                        dataKey="painLevel"
                        fill="#ef4444"
                        name="Pain Level"
                      />
                      <Bar dataKey="mobility" fill="#22c55e" name="Mobility" />
                      <Bar dataKey="strength" fill="#8b5cf6" name="Strength" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 shadow-xl">
              <CardContent className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <BarChart3 className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  No Progress Data Available
                </h3>
                <p className="text-slate-400">
                  Start tracking your progress to see detailed reports and
                  trends.
                </p>
                <div className="mt-4">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    Record your first progress entry to unlock insights
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
