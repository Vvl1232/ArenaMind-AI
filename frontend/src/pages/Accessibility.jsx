/**
 * StadiumPilot AI — Accessibility Page
 */

import { useState, useCallback } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { HiHeart } from "react-icons/hi";
import { getStadiumData, getAccessibilityInfo } from "../services/api";
import FacilityList from "../components/FacilityList";
import AiAskForm from "../components/AiAskForm";
import AiResponseCard from "../components/AiResponseCard";
import PageHeader from "../components/PageHeader";

const AccessibilitySkeleton = () => (
  <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse" role="status" aria-live="polite" aria-label="Loading accessibility data...">
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
  const { data: stadiumData, loading } = useFetchData(getStadiumData, "Failed to load stadium data");
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [asking, setAsking] = useState(false);

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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6" role="region" aria-label="Accessibility Support">
      {/* Header */}
      <PageHeader
        title="Accessibility Support"
        description="AI-powered assistance for fans with disabilities and special needs"
        icon={<HiHeart className="w-7 h-7 text-pink-400" />}
      />

      {/* AI Ask */}
      <AiAskForm
        query={query}
        setQuery={setQuery}
        asking={asking}
        handleAsk={handleAsk}
        placeholder="Ask about accessibility — wheelchair routes, accessible facilities, medical help..."
        quickQuestions={quickQuestions}
        onQuickQuestion={handleQuickQuestion}
        buttonText="Ask"
      />

      {/* AI Response */}
      <AiResponseCard
        response={aiResponse}
        title="AI Accessibility Guidance"
        icon={<HiHeart className="w-4 h-4 text-pink-400" />}
      />

      {/* Accessible Gates */}
      <FacilityList
        title="🚪 Accessible Gates"
        items={accessibleGates}
        type="gate"
        delay={0.2}
      />

      {/* Accessible Restrooms */}
      <FacilityList
        title="🚻 Accessible Restrooms"
        items={accessibleRestrooms}
        type="restroom"
        delay={0.3}
      />

      {/* Medical Centers */}
      <FacilityList
        title="🏥 Medical Centers"
        items={medicalCenters}
        type="medical"
        delay={0.4}
      />

      {/* Volunteer Stations */}
      <FacilityList
        title="🙋 Volunteer Stations"
        items={volunteerStations}
        type="volunteer"
        delay={0.5}
      />
    </div>
  );
};

export default Accessibility;
