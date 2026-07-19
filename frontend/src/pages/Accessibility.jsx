/**
 * StadiumPilot AI — Accessibility Page
 */

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { HiHeart, HiPaperAirplane } from "react-icons/hi";
import { getStadiumData, getAccessibilityInfo } from "../services/api";
import AccessibilityCard from "../components/AccessibilityCard";
import Loader from "../components/Loader";

const AccessibilitySkeleton = () => (
  <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
    <div>
      <div className="h-8 bg-bg-secondary rounded w-1/4 mb-2" />
      <div className="h-4 bg-bg-secondary rounded w-1/3" />
    </div>
    <div className="h-24 bg-bg-secondary rounded-xl w-full mb-6" />
    <div className="h-6 bg-bg-secondary rounded w-1/4 mb-4" />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 glass-card rounded-xl" />
      ))}
    </div>
    <div className="h-6 bg-bg-secondary rounded w-1/4 mb-4" />
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 glass-card rounded-xl" />
      ))}
    </div>
  </div>
);

const quickQuestions = [
  "Where are the wheelchair-accessible restrooms?",
  "What accessible routes are available from Gate A1 to Section 200?",
  "Where can I find medical assistance?",
  "Are there accessible seating areas near food courts?",
  "Where are the volunteer stations with wheelchair support?",
];

const Accessibility = () => {
  const [stadiumData, setStadiumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStadiumData();
        setStadiumData(data);
      } catch (err) {
        console.error("Failed to load stadium data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAsk = useCallback(async (e) => {
    e?.preventDefault();
    const q = typeof e === "string" ? e : query;
    if (!q.trim() || asking) return;
    setAsking(true);
    setAiResponse(null);
    try {
      const result = await getAccessibilityInfo(q);
      setAiResponse(result.response);
    } catch (err) {
      setAiResponse(
        "⚠️ Failed to get accessibility guidance. Please ensure the backend is running.",
      );
    } finally {
      setAsking(false);
    }
  }, [query, asking]);

  const handleQuickQuestion = useCallback((q) => {
    setQuery(q);
    setAsking(true);
    setAiResponse(null);
    getAccessibilityInfo(q)
      .then((result) => setAiResponse(result.response))
      .catch(() => setAiResponse("⚠️ Failed to get accessibility guidance."))
      .finally(() => setAsking(false));
  }, []);

  if (loading) {
    return <AccessibilitySkeleton />;
  }

  const accessibleRestrooms =
    stadiumData?.restrooms?.filter((r) => r.accessible) || [];
  const medicalCenters = stadiumData?.medical || [];
  const accessibleGates =
    stadiumData?.gates?.filter((g) => g.accessible && g.status === "open") ||
    [];
  const volunteerStations = stadiumData?.volunteer_stations || [];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <HiHeart className="w-7 h-7 text-pink-400" />
          Accessibility Support
        </h1>
        <p className="text-sm text-text-muted mt-1">
          AI-powered assistance for fans with disabilities and special needs
        </p>
      </motion.div>

      {/* AI Ask */}
      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleAsk}
        className="glass-card p-4 space-y-3"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about accessibility — wheelchair routes, accessible facilities, medical help..."
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={!query.trim() || asking}
            className="btn-primary flex items-center gap-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            {asking ? (
              <Loader text="" variant="light" />
            ) : (
              <HiPaperAirplane className="w-4 h-4 rotate-90" />
            )}
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleQuickQuestion(q)}
              className="px-3 py-1.5 text-xs rounded-lg bg-bg-secondary border border-border 
                         text-text-muted hover:text-text-primary hover:border-pink-500/50 
                         hover:bg-pink-500/10 transition-all duration-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              {q}
            </button>
          ))}
        </div>
      </motion.form>

      {/* AI Response */}
      {aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
          aria-live="polite"
        >
          <h3 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
            <HiHeart className="w-4 h-4 text-pink-400" />
            AI Accessibility Guidance
          </h3>
          <div className="markdown-content text-sm leading-relaxed text-text-primary">
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
        </motion.div>
      )}

      {/* Accessible Gates */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold text-text-primary mb-3">
          🚪 Accessible Gates ({accessibleGates.length})
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessibleGates.map((gate, i) => (
            <AccessibilityCard
              key={gate.id}
              facility={gate}
              type="gate"
              delay={0.05 * i}
            />
          ))}
        </div>
      </motion.section>

      {/* Accessible Restrooms */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-bold text-text-primary mb-3">
          🚻 Accessible Restrooms ({accessibleRestrooms.length})
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessibleRestrooms.map((r, i) => (
            <AccessibilityCard
              key={r.id}
              facility={r}
              type="restroom"
              delay={0.05 * i}
            />
          ))}
        </div>
      </motion.section>

      {/* Medical Centers */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-bold text-text-primary mb-3">
          🏥 Medical Centers ({medicalCenters.length})
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicalCenters.map((m, i) => (
            <AccessibilityCard
              key={m.id}
              facility={m}
              type="medical"
              delay={0.05 * i}
            />
          ))}
        </div>
      </motion.section>

      {/* Volunteer Stations */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-bold text-text-primary mb-3">
          🙋 Volunteer Stations ({volunteerStations.length})
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {volunteerStations.map((vs, i) => (
            <AccessibilityCard
              key={vs.id}
              facility={vs}
              type="volunteer"
              delay={0.05 * i}
            />
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Accessibility;
