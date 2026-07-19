/**
 * StadiumPilot AI — API Service
 *
 * Axios-based service for all backend communication.
 */

import apiClient from "../utils/apiClient";

/**
 * Send a chat message to the AI assistant.
 */
export const sendChatMessage = async (message, language = null, context = null, options = {}) => {
  const data = await apiClient.post("/api/chat", { message, language, context }, options);
  return data;
};

/**
 * Get navigation directions.
 */
export const getNavigation = async (
  origin,
  destination,
  accessible = false,
) => {
  const data = await apiClient.post("/api/navigate", {
    origin,
    destination,
    accessible,
  });
  return data;
};

/**
 * Get operations recommendation.
 */
export const getOperationsRecommendation = async (
  scenario,
  priority = "medium",
  zone = null,
) => {
  const data = await apiClient.post("/api/operations", {
    scenario,
    priority,
    zone,
  });
  return data;
};

/**
 * Get transport data.
 */
export const getTransportData = async () => {
  const data = await apiClient.get("/api/transport");
  return data;
};

/**
 * Ask transport AI.
 */
export const askTransport = async (query) => {
  const data = await apiClient.post("/api/transport/ask", { query });
  return data;
};

/**
 * Get accessibility guidance.
 */
export const getAccessibilityInfo = async (query) => {
  const data = await apiClient.post("/api/accessibility", { query });
  return data;
};

/**
 * Get stadium data.
 */
export const getStadiumData = async () => {
  const data = await apiClient.get("/api/stadium");
  return data;
};

/**
 * Get crowd data.
 */
export const getCrowdData = async () => {
  const data = await apiClient.get("/api/crowd");
  return data;
};

/**
 * Health check.
 */
export const healthCheck = async () => {
  const data = await apiClient.get("/api/health");
  return data;
};

export default apiClient;
