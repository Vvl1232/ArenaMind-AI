/**
 * StadiumPilot AI — Constants
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://arena-mind-api.vercel.app";

export const QUICK_PROMPTS = [
  "Where is Gate B12?",
  "Nearest restroom from North Stand",
  "Food options under $15",
  "Where is the medical center?",
  "Emergency exits near me",
  "Parking availability",
  "Lost and Found office",
  "Wheelchair accessible routes",
];

export const RISK_COLORS = {
  low: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  moderate: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  high: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
  critical: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
  },
};

export const ZONE_COLORS = {
  "Z-NORTH": "#5B2D8E",
  "Z-EAST": "#D4145A",
  "Z-SOUTH": "#00B4D8",
  "Z-WEST": "#FFB627",
};
