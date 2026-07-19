import React from "react";
import PropTypes from "prop-types";
/**
 * StadiumPilot AI — DashboardCard Component
 */

import { motion } from "framer-motion";

const COLOR_MAP = {
  purple: {
    bg: "bg-fifa-purple/10",
    border: "border-fifa-purple/20",
    text: "text-fifa-purple dark:text-white",
    glow: "shadow-sm",
  },
  magenta: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-600 dark:text-pink-400",
    glow: "shadow-sm",
  },
  teal: {
    bg: "bg-fifa-teal/10",
    border: "border-fifa-teal/20",
    text: "text-fifa-teal",
    glow: "shadow-sm",
  },
  gold: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    glow: "shadow-sm",
  },
  green: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    glow: "shadow-sm",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    text: "text-red-600 dark:text-red-400",
    glow: "shadow-sm",
  },
};

const DashboardCard = React.memo(({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "purple",
  trend,
  delay = 0,
}) => {
  const c = COLOR_MAP[color] || COLOR_MAP.purple;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass-card-hover p-5 ${c.glow}`}
      role="region"
      aria-label={`${title} statistics card`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${c.bg} border ${c.border}`} aria-hidden="true">
          {Icon && <Icon className={`w-5 h-5 ${c.text}`} />}
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold ${trend > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
            aria-label={`Trend is ${trend > 0 ? "up" : "down"} by ${Math.abs(trend)} percent`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <h3 className="text-sm text-text-muted font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-text-primary" aria-label={`Value is ${value}`}>{value}</p>
      {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
    </motion.div>
  );
});

DashboardCard.displayName = "DashboardCard";

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  color: PropTypes.string,
  trend: PropTypes.number,
  delay: PropTypes.number,
};

export default DashboardCard;
