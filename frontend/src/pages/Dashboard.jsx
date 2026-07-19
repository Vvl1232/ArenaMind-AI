/**
 * StadiumPilot AI — Dashboard Page
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  HiUsers,
  HiShieldCheck,
  HiClock,
  HiExclamation,
  HiTrendingUp,
  HiLocationMarker,
  HiLightningBolt,
  HiGlobeAlt,
} from "react-icons/hi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DashboardCard from "../components/DashboardCard";
import { Suspense, lazy } from "react";
const CrowdChart = lazy(() => import("../components/CrowdChart"));
import { getCrowdData } from "../services/api";

const RISK_COLORS = {
  low: "rgb(var(--color-status-low))",
  moderate: "rgb(var(--color-status-moderate))",
  high: "rgb(var(--color-status-high))",
  critical: "rgb(var(--color-status-high))",
};

const DashboardSkeleton = () => (
  <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
    <div>
      <div className="h-8 bg-bg-secondary rounded w-1/4 mb-2" />
      <div className="h-4 bg-bg-secondary rounded w-1/3" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 glass-card rounded-xl" />
      ))}
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="h-80 glass-card rounded-xl" />
      <div className="h-80 glass-card rounded-xl" />
    </div>
  </div>
);

const Dashboard = () => {
  const [crowdData, setCrowdData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulated timeline data for area chart
  const timelineData = React.useMemo(() => [
    { time: "16:00", north: 45, east: 40, south: 30, west: 35 },
    { time: "16:30", north: 55, east: 50, south: 38, west: 42 },
    { time: "17:00", north: 68, east: 62, south: 48, west: 55 },
    { time: "17:30", north: 78, east: 72, south: 58, west: 65 },
    { time: "18:00", north: 85, east: 80, south: 68, west: 75 },
    { time: "18:30", north: 88, east: 86, south: 75, west: 82 },
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [crowd] = await Promise.all([getCrowdData()]);
        setCrowdData(crowd);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const overall = crowdData?.overall || {};
  const zones = crowdData?.zones || [];
  const hotspots = crowdData?.hotspots || [];
  const incidents = crowdData?.incidents || [];
  const predictions = crowdData?.predictions || [];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6" role="region" aria-label="Live Dashboard">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Operations Dashboard
          </h1>
          <p className="text-sm text-text-muted">
            Real-time crowd intelligence & stadium analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-info flex items-center gap-1.5">
            <HiLightningBolt className="w-3 h-3" />
            Live Data
          </span>
          <span className="text-xs text-text-muted">
            Updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </motion.div>

      {/* Sustainability Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 flex items-center justify-between border border-emerald-500/20 bg-emerald-500/5"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
            <HiGlobeAlt className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Sustainability Focus (FIFA 2026 Target)</h3>
            <p className="text-xs text-text-muted mt-0.5">Energy efficiency optimization is currently active. Waste diversion rate: 82%.</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-emerald-400">Carbon Offset</span>
          <p className="text-sm font-black text-text-primary mt-0.5">-4.2t CO2</p>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Attendance"
          value={overall.total_attendance?.toLocaleString() || "—"}
          subtitle={`${overall.occupancy_percent || 0}% capacity`}
          icon={HiUsers}
          color="purple"
          delay={0}
        />
        <DashboardCard
          title="Risk Level"
          value={overall.risk_level?.toUpperCase() || "—"}
          subtitle="Stadium-wide assessment"
          icon={HiShieldCheck}
          color={
            overall.risk_level === "high"
              ? "red"
              : overall.risk_level === "moderate"
                ? "gold"
                : "green"
          }
          delay={0.1}
        />
        <DashboardCard
          title="Ingress Rate"
          value={`${overall.ingress_rate_per_min || 0}/min`}
          subtitle="Fans entering stadium"
          icon={HiTrendingUp}
          color="teal"
          trend={12}
          delay={0.2}
        />
        <DashboardCard
          title="Active Incidents"
          value={incidents.filter((i) => i.status === "active").length}
          subtitle={`${incidents.length} total today`}
          icon={HiExclamation}
          color={incidents.some((i) => i.status === "active") ? "red" : "green"}
          delay={0.3}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Crowd Chart */}
        <Suspense
          fallback={
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-center h-80 text-white/50">
              Loading chart...
            </div>
          }
        >
          <CrowdChart data={crowdData} />
        </Suspense>

        {/* Occupancy Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <h3 className="text-lg font-bold text-text-primary mb-1">
            Occupancy Timeline
          </h3>
          <p className="text-xs text-text-muted mb-4">
            Zone occupancy over time
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="gNorth" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="rgb(var(--color-fifa-purple))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(var(--color-fifa-purple))"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="gEast" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="rgb(var(--color-fifa-magenta))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(var(--color-fifa-magenta))"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="gSouth" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="rgb(var(--color-fifa-teal))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(var(--color-fifa-teal))"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="gWest" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="rgb(var(--color-fifa-gold))"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(var(--color-fifa-gold))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgb(var(--color-border))"
              />
              <XAxis
                dataKey="time"
                tick={{ fill: "rgb(var(--color-text-muted))", fontSize: 12 }}
                axisLine={{ stroke: "rgb(var(--color-border))" }}
              />
              <YAxis
                tick={{ fill: "rgb(var(--color-text-muted))", fontSize: 12 }}
                axisLine={{ stroke: "rgb(var(--color-border))" }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(var(--color-bg-card))",
                  border: "1px solid rgb(var(--color-border))",
                  borderRadius: "12px",
                }}
                itemStyle={{ color: "rgb(var(--color-text-primary))" }}
                labelStyle={{
                  color: "rgb(var(--color-text-muted))",
                  marginBottom: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="north"
                stroke="rgb(var(--color-fifa-purple))"
                fill="url(#gNorth)"
                strokeWidth={2}
                name="North"
              />
              <Area
                type="monotone"
                dataKey="east"
                stroke="rgb(var(--color-fifa-magenta))"
                fill="url(#gEast)"
                strokeWidth={2}
                name="East"
              />
              <Area
                type="monotone"
                dataKey="south"
                stroke="rgb(var(--color-fifa-teal))"
                fill="url(#gSouth)"
                strokeWidth={2}
                name="South"
              />
              <Area
                type="monotone"
                dataKey="west"
                stroke="rgb(var(--color-fifa-gold))"
                fill="url(#gWest)"
                strokeWidth={2}
                name="West"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Zone Cards + Hotspots */}
      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        {/* Zone Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-text-primary">
              Zone Intelligence
            </h3>
            <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-fifa-purple/10 text-fifa-purple border border-fifa-purple/20">
              LIVE
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {zones.map((zone, i) => (
              <motion.div
                key={zone.zone_id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="glass-card-hover p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-bold text-text-primary">
                    {zone.name}
                  </h4>
                  <span
                    className={`badge ${
                      zone.risk_level === "high"
                        ? "badge-danger"
                        : zone.risk_level === "moderate"
                          ? "badge-warning"
                          : "badge-success"
                    }`}
                  >
                    {zone.risk_level.toUpperCase()}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-medium text-text-muted mb-2">
                    <span>
                      {zone.current_count?.toLocaleString()} /{" "}
                      {zone.capacity?.toLocaleString()}
                    </span>
                    <span className="font-bold text-text-primary">
                      {zone.occupancy_percent}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-bg-secondary rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.occupancy_percent}%` }}
                      transition={{ duration: 1, delay: 0.2 * i }}
                      className="h-full rounded-full relative"
                      style={{
                        backgroundColor:
                          RISK_COLORS[zone.risk_level] ||
                          "rgb(var(--color-fifa-purple))",
                        boxShadow: `0 0 10px ${RISK_COLORS[zone.risk_level] || "transparent"}`,
                      }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[pulse_2s_ease-in-out_infinite]" />
                    </motion.div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-text-muted bg-bg-secondary/50 p-2.5 rounded-lg border border-border">
                  <span className="flex items-center gap-1.5">
                    <HiClock className="w-4 h-4 text-fifa-teal" />{" "}
                    {zone.wait_time_entry_min} min wait
                  </span>
                  <div className="w-px h-3 bg-border" />
                  <span className="flex items-center gap-1.5">
                    <HiLocationMarker className="w-4 h-4 text-fifa-magenta" />{" "}
                    {zone.temperature_celsius}°C
                  </span>
                </div>

                {zone.alerts?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {zone.alerts.map((alert, j) => (
                      <div
                        key={j}
                        className="flex items-start gap-2 p-2.5 rounded-lg bg-status-moderate/10 border border-status-moderate/20"
                      >
                        <HiExclamation className="w-4 h-4 text-status-moderate flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-status-moderate font-medium leading-relaxed">
                          {alert}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hotspots + Predictions */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold text-text-primary">
                🔥 Hotspots
              </h3>
            </div>
            <div className="space-y-3">
              {hotspots.map((spot, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="group glass-card p-3.5 flex items-center gap-4 hover:border-fifa-purple/30 cursor-default"
                >
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-bg-secondary border border-border group-hover:border-transparent transition-colors">
                    <div
                      className="w-3.5 h-3.5 rounded-full shadow-glow"
                      style={{
                        backgroundColor:
                          RISK_COLORS[spot.severity] ||
                          "rgb(var(--color-fifa-purple))",
                        boxShadow: `0 0 12px ${RISK_COLORS[spot.severity] || "transparent"}`,
                      }}
                    />
                    <div
                      className="absolute inset-0 rounded-xl bg-current opacity-0 group-hover:opacity-10 transition-opacity"
                      style={{ color: RISK_COLORS[spot.severity] }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary truncate">
                      {spot.location}
                    </p>
                    <p className="text-xs font-medium text-text-muted mt-0.5 truncate">
                      {spot.action_required}
                    </p>
                  </div>
                  <div className="text-right pl-2 border-l border-border">
                    <span
                      className="text-lg font-black"
                      style={{ color: RISK_COLORS[spot.severity] }}
                    >
                      {(spot.density * 100).toFixed(0)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold text-text-primary">
                📋 Predictions
              </h3>
            </div>
            <div className="space-y-3">
              {predictions.map((pred, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + 0.1 * i }}
                  className="glass-card p-4 relative overflow-hidden group"
                >
                  <div
                    className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{
                      backgroundColor:
                        RISK_COLORS[pred.risk] ||
                        "rgb(var(--color-fifa-purple))",
                    }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <HiClock className="w-4 h-4 text-text-muted" />{" "}
                        {pred.event}
                      </p>
                      <span
                        className={`badge ${
                          pred.risk === "critical"
                            ? "badge-danger"
                            : "badge-warning"
                        }`}
                      >
                        {pred.risk}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-medium bg-bg-primary/60 p-3 rounded-lg border border-border/50">
                      {pred.recommendation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
