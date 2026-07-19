import PropTypes from "prop-types";
/**
 * StadiumPilot AI — CrowdChart Component
 *
 * Displays crowd density data using Recharts.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { memo, useMemo } from "react";
import { motion } from "framer-motion";

const ZONE_COLORS = [
  "rgb(var(--color-fifa-purple))",
  "rgb(var(--color-fifa-magenta))",
  "rgb(var(--color-fifa-teal))",
  "rgb(var(--color-fifa-gold))",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-card p-3 text-sm">
        <p className="font-semibold text-text-primary">{data.name}</p>
        <p className="text-text-muted">
          Occupancy:{" "}
          <span className="text-text-primary">{data.occupancy}%</span>
        </p>
        <p className="text-text-muted">
          Count:{" "}
          <span className="text-text-primary">
            {data.count?.toLocaleString()}
          </span>
        </p>
        <p className="text-text-muted">
          Risk:{" "}
          <span
            className={
              data.risk === "high"
                ? "text-red-600 dark:text-red-400"
                : data.risk === "moderate"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
            }
          >
            {data.risk}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const CrowdChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || !data.zones) return [];
    return data.zones.map((zone) => ({
      name: zone.name.replace(" Stand", ""),
      occupancy: zone.occupancy_percent,
      count: zone.current_count,
      risk: zone.risk_level,
    }));
  }, [data]);

  if (!chartData.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-text-primary">
            Zone Occupancy
          </h3>
          <p className="text-xs text-text-muted">
            Real-time crowd density by zone
          </p>
        </div>
        <div className="badge-info">Live</div>
      </div>

      <ResponsiveContainer
        width="100%"
        height={300}
        role="img"
        aria-label="Real-time crowd density chart by zone"
      >
        <BarChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgb(var(--color-border))"
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgb(var(--color-text-muted))", fontSize: 12 }}
            axisLine={{ stroke: "rgb(var(--color-border))" }}
          />
          <YAxis
            tick={{ fill: "rgb(var(--color-text-muted))", fontSize: 12 }}
            axisLine={{ stroke: "rgb(var(--color-border))" }}
            domain={[0, 100]}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgb(var(--color-bg-secondary))", opacity: 0.5 }}
          />
          <Bar dataKey="occupancy" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={ZONE_COLORS[i % ZONE_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

CrowdChart.propTypes = { data: PropTypes.object.isRequired };
CustomTooltip.propTypes = { active: PropTypes.bool, payload: PropTypes.array };

export default memo(CrowdChart);
