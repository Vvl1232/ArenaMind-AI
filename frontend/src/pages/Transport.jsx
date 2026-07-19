/**
 * StadiumPilot AI — Transport Page
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { HiPaperAirplane } from "react-icons/hi";
import { getTransportData, askTransport } from "../services/api";
import TransportCard from "../components/TransportCard";
import Loader from "../components/Loader";

const TransportSkeleton = () => (
  <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
    <div>
      <div className="h-8 bg-bg-secondary rounded w-1/4 mb-2" />
      <div className="h-4 bg-bg-secondary rounded w-1/3" />
    </div>
    <div className="h-16 bg-bg-secondary rounded-xl w-full" />
    <div className="h-48 bg-bg-secondary rounded-xl w-full" />
    <div className="grid sm:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 glass-card rounded-xl" />
      ))}
    </div>
  </div>
);

const Transport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTransportData();
        setData(result);
      } catch (err) {
        console.error("Failed to load transport data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAsk = React.useCallback(async (e) => {
    e.preventDefault();
    if (!query.trim() || asking) return;
    setAsking(true);
    setAiResponse(null);
    try {
      const result = await askTransport(query);
      setAiResponse(result.response);
    } catch (err) {
      setAiResponse(
        "⚠️ Failed to get transport guidance. Please ensure the backend is running.",
      );
    } finally {
      setAsking(false);
    }
  }, [query, asking]);

  if (loading) {
    return <TransportSkeleton />;
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-text-primary">
          🚌 Transport Intelligence
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Real-time transport options and AI-powered travel guidance
        </p>
      </motion.div>

      {/* AI Ask */}
      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleAsk}
        className="glass-card p-4 flex gap-2"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about transport — e.g., 'Best way to get to Manhattan after the match?'"
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
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </motion.form>

      {/* AI Response */}
      {aiResponse && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5"
          aria-live="polite"
        >
          <h3 className="text-sm font-bold text-text-primary mb-2">
            🤖 AI Transport Guidance
          </h3>
          <div className="markdown-content text-sm leading-relaxed text-text-primary">
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
        </motion.div>
      )}

      {/* Parking Status */}
      {data?.parking_status && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-5"
        >
          <h3 className="text-lg font-bold text-text-primary mb-3">
            🅿️ Parking Status
          </h3>
          <div className="grid sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {data.parking_status.available_spaces?.toLocaleString()}
              </p>
              <p className="text-xs text-text-muted">Available Spaces</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {data.parking_status.total_spaces?.toLocaleString()}
              </p>
              <p className="text-xs text-text-muted">Total Spaces</p>
            </div>
            <div>
              <p
                className={`text-2xl font-bold ${data.parking_status.exit_congestion === "moderate" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
              >
                {data.parking_status.exit_congestion}
              </p>
              <p className="text-xs text-text-muted">Exit Congestion</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {data.parking_status.estimated_exit_time_min} min
              </p>
              <p className="text-xs text-text-muted">Est. Exit Time</p>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-3 pt-3 border-t border-border">
            💡 {data.parking_status.recommendation}
          </p>
        </motion.div>
      )}

      {/* Transport Cards by Type */}
      {["metro", "bus", "taxi", "rideshare"].map((type) => {
        const items = data?.[type];
        if (!items || items.length === 0) return null;
        return (
          <motion.section
            key={type}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-text-primary mb-3 capitalize">
              {type === "metro"
                ? "🚇"
                : type === "bus"
                  ? "🚌"
                  : type === "taxi"
                    ? "🚕"
                    : "🚗"}{" "}
              {type}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map((item, i) => (
                <TransportCard
                  key={item.id}
                  item={item}
                  type={type}
                  delay={0.05 * i}
                />
              ))}
            </div>
          </motion.section>
        );
      })}

      {/* Walking Routes */}
      {data?.walking_routes && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-bold text-text-primary mb-3">
            🚶 Walking Routes
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.walking_routes.map((route, i) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="glass-card-hover p-4"
              >
                <h4 className="text-sm font-semibold text-text-primary mb-2">
                  {route.name}
                </h4>
                <div className="space-y-1 text-xs text-text-muted">
                  <p>
                    📍 {route.from} → {route.to}
                  </p>
                  <p>
                    📏 {route.distance_km} km · ⏱️ {route.time_min} min
                  </p>
                  <p>
                    {route.accessible ? "♿ Accessible" : "⚠️ Not Accessible"} ·{" "}
                    {route.lit ? "💡 Well-lit" : ""}
                  </p>
                </div>
                {route.notes && (
                  <p className="text-xs text-text-muted mt-2 pt-2 border-t border-border">
                    {route.notes}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default Transport;
