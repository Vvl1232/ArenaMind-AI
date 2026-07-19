import PropTypes from "prop-types";
/**
 * StadiumPilot AI — Sidebar Component
 */

import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome,
  HiChat,
  HiTruck,
  HiHeart,
  HiX,
  HiSparkles,
  HiLocationMarker,
  HiUserGroup,
  HiGlobeAlt,
  HiTranslate,
  HiLightningBolt,
  HiLightBulb,
} from "react-icons/hi";

const navItems = [
  { path: "/", label: "Home", icon: HiHome },
  { path: "/chat", label: "AI Chat", icon: HiChat },
  { path: "/assistant", label: "Navigation", icon: HiLocationMarker },
  { path: "/crowd-management", label: "Crowd Management", icon: HiUserGroup },
  { path: "/accessibility", label: "Accessibility", icon: HiHeart },
  { path: "/transport", label: "Transportation", icon: HiTruck },
  { path: "/sustainability", label: "Sustainability", icon: HiGlobeAlt },
  {
    path: "/multilingual",
    label: "Multilingual Assistance",
    icon: HiTranslate,
  },
  {
    path: "/operations",
    label: "Operational Intelligence",
    icon: HiLightningBolt,
  },
  {
    path: "/decision-support",
    label: "Real-time Decision Support",
    icon: HiLightBulb,
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarContent = (
    <div className="flex flex-col h-full py-6 px-3">
      {/* Branding */}
      <Link
        to="/"
        className="flex items-center gap-3 px-3 mb-8 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-lg"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-fifa-gradient flex items-center justify-center shadow-glow group-hover:shadow-glow-magenta transition-shadow">
            <HiSparkles className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-status-low rounded-full border-2 border-bg-primary animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold gradient-text leading-tight">
            StadiumPilot
          </h1>
          <p className="text-[10px] text-text-secondary font-bold uppercase tracking-wider -mt-0.5">
            FIFA World Cup 2026
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1" aria-label="Main Navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ${
                isActive
                  ? "bg-accent-primary/10 text-accent-primary dark:text-white border border-accent-primary/20 shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary border border-transparent"
              }`
            }
          >
            <item.icon
              className={`w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform ${
                // Apply purple explicitly to the icon on active state for light mode
                "group-[.active]:text-accent-primary dark:group-[.active]:text-white"
              }`}
            />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Info */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="glass-card p-3">
          <p className="text-xs font-semibold text-fifa-teal mb-1">
            Powered by
          </p>
          <p className="text-xs text-text-secondary">Groq AI</p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-status-low" />
            <span className="text-[10px] text-status-low font-bold">
              All Systems Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-60 bg-bg-primary/95 backdrop-blur-xl border-r border-border z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-bg-primary border-r border-border z-50 lg:hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-5 right-4 p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
                aria-label="Close Sidebar"
              >
                <HiX className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
