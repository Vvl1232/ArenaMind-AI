import PropTypes from "prop-types";
/**
 * StadiumPilot AI — Navbar Component
 */

import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HiMenuAlt3, HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";

const PAGE_META = {
  "/": { name: "🏠 Home", sub: "FIFA World Cup 2026 AI Platform" },
  "/chat": { name: "🤖 AI Chat", sub: "Ask anything about the stadium" },
  "/assistant": {
    name: "🗺️ Navigation",
    sub: "Step-by-step stadium wayfinding",
  },
  "/crowd-management": {
    name: "👥 Crowd Management",
    sub: "Real-time zone occupancy & risk levels",
  },
  "/accessibility": {
    name: "♿ Accessibility",
    sub: "Wheelchair routes & assistance",
  },
  "/transport": {
    name: "🚌 Transportation",
    sub: "Metro · Bus · Taxi · Parking",
  },
  "/sustainability": {
    name: "🌍 Sustainability",
    sub: "Eco insights & green initiatives",
  },
  "/multilingual": {
    name: "🌐 Multilingual Assistance",
    sub: "Support in 6+ languages",
  },
  "/operations": {
    name: "⚡ Operational Intelligence",
    sub: "AI-powered crowd management",
  },
  "/decision-support": {
    name: "💡 Real-time Decision Support",
    sub: "Live AI recommendations for staff",
  },
  "/dashboard": {
    name: "📊 Live Dashboard",
    sub: "Real-time crowd analytics & KPIs",
  },
};

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const meta = PAGE_META[location.pathname] || {
    name: "🏟️ StadiumPilot AI",
    sub: "FIFA World Cup 2026",
  };

  return (
    <motion.nav
      aria-label="Top Navigation"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-4 right-4 lg:left-64 lg:right-4 z-50 h-16 bg-bg-primary/70 backdrop-blur-2xl border border-border rounded-2xl shadow-sm"
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Mobile toggle + Page title + Subtitle */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden shrink-0 p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            aria-label="Toggle Sidebar"
            aria-expanded={sidebarOpen}
          >
            <HiMenuAlt3 className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 min-w-0">
            <span className="text-base font-bold text-text-primary whitespace-nowrap">
              {meta.name}
            </span>
            <span className="hidden md:inline-block text-xs text-text-muted font-medium border-l border-border pl-3 truncate">
              {meta.sub}
            </span>
          </div>
        </div>

        {/* Right: Theme toggle + Live badge */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-bg-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <HiSun className="w-5 h-5" />
            ) : (
              <HiMoon className="w-5 h-5" />
            )}
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-status-low/10 border border-status-low/20">
            <div className="w-2 h-2 rounded-full bg-status-low animate-pulse" />
            <span className="text-xs font-bold text-status-low uppercase">
              Live
            </span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

Navbar.propTypes = { onToggleSidebar: PropTypes.func.isRequired, sidebarOpen: PropTypes.bool };

export default Navbar;
