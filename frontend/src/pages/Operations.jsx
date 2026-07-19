/**
 * StadiumPilot AI — Operations Page
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  HiShieldCheck,
  HiPaperAirplane,
  HiLightningBolt,
} from "react-icons/hi";
import { getOperationsRecommendation } from "../services/api";
import Loader from "../components/Loader";

const presetScenarios = [
  {
    label: "Gate A1 Overcrowded",
    scenario:
      "Gate A1 is at 88% capacity with 14-minute wait times. Fans are becoming agitated. Need immediate action plan.",
    priority: "high",
    zone: "North",
  },
  {
    label: "Medical Emergency",
    scenario:
      "Multiple fans reporting heat exhaustion in the East Stand. Temperature is 29°C. Need emergency response plan.",
    priority: "critical",
    zone: "East",
  },
  {
    label: "Halftime Crowd Surge",
    scenario:
      "Halftime is approaching. Need a proactive plan to manage expected crowd movement to food courts and restrooms.",
    priority: "high",
    zone: null,
  },
  {
    label: "Post-Match Egress",
    scenario:
      "Full time approaching. Need comprehensive egress plan to safely evacuate 82,500 fans via all transport options.",
    priority: "critical",
    zone: null,
  },
  {
    label: "VIP Area Congestion",
    scenario:
      "VIP entrance corridor is experiencing moderate congestion. VIP guests are complaining about wait times.",
    priority: "medium",
    zone: "West",
  },
  {
    label: "Lost Child Report",
    scenario:
      "A lost child has been reported in the South Stand, age approximately 6 years old. Need coordinated search and reunion protocol.",
    priority: "high",
    zone: "South",
  },
];

const Operations = () => {
  const [scenario, setScenario] = useState("");
  const [priority, setPriority] = useState("medium");
  const [zone, setZone] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!scenario.trim() || loading) return;
    setLoading(true);
    setResponse(null);
    try {
      const data = await getOperationsRecommendation(
        scenario,
        priority,
        zone || null,
      );
      setResponse(data.response);
    } catch (err) {
      setResponse(
        "⚠️ Failed to get operational recommendations. Please ensure the backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }, [scenario, priority, zone, loading]);

  const handlePreset = useCallback((preset) => {
    setScenario(preset.scenario);
    setPriority(preset.priority);
    setZone(preset.zone || "");
  }, []);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <HiShieldCheck className="w-7 h-7 text-fifa-teal" />
          Operations Copilot
        </h1>
        <p className="text-sm text-text-muted mt-1">
          AI-powered operational intelligence for organizers, security, and
          venue managers
        </p>
      </motion.div>

      {/* Preset Scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-sm font-semibold text-text-muted mb-3 flex items-center gap-1.5">
          <HiLightningBolt className="w-4 h-4 text-fifa-gold" />
          Quick Scenarios
        </h3>
        <div className="flex flex-wrap gap-2">
          {presetScenarios.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset)}
              className="px-3 py-1.5 text-xs rounded-full bg-bg-secondary border border-border 
                         text-text-muted hover:text-text-primary hover:border-fifa-purple/50 
                         hover:bg-fifa-purple/10 transition-all duration-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="glass-card p-6 space-y-4"
      >
        <div>
          <label
            htmlFor="scenario-input"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            Scenario Description
          </label>
          <textarea
            id="scenario-input"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Describe the operational scenario..."
            rows={4}
            className="input-field resize-none w-full"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="priority-select"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Priority
            </label>
            <select
              id="priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input-field w-full"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🟠 High</option>
              <option value="critical">🔴 Critical</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="zone-select"
              className="block text-sm font-medium text-text-primary mb-2"
            >
              Zone (Optional)
            </label>
            <select
              id="zone-select"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="input-field w-full"
            >
              <option value="">All Zones</option>
              <option value="North">North Stand</option>
              <option value="East">East Stand</option>
              <option value="South">South Stand</option>
              <option value="West">West Stand</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!scenario.trim() || loading}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
        >
          {loading ? (
            <Loader text="Analyzing..." variant="light" />
          ) : (
            <>
              <HiPaperAirplane className="w-4 h-4 rotate-90" />
              Get AI Recommendations
            </>
          )}
        </button>
      </motion.form>

      {/* Response */}
      {response && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
          aria-live="polite"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-fifa-gradient flex items-center justify-center">
              <HiShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                AI Operational Recommendation
              </h3>
              <p className="text-xs text-text-muted">
                Generated by StadiumPilot AI
              </p>
            </div>
          </div>
          <div className="markdown-content text-sm leading-relaxed text-text-primary">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Operations;
