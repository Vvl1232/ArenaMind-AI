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
  options = {}
) => {
  const data = await apiClient.post("/api/navigate", {
    origin,
    destination,
    accessible,
  }, options);
  return data;
};

/**
 * Get operations recommendation.
 */
export const getOperationsRecommendation = async (
  scenario,
  priority = "medium",
  zone = null,
  options = {}
) => {
  const data = await apiClient.post("/api/operations", {
    scenario,
    priority,
    zone,
  }, options);
  return data;
};

/**
 * Get transport data.
 */
export const getTransportData = async (options = {}) => {
  const data = await apiClient.get("/api/transport", options);
  return data;
};

/**
 * Ask transport AI.
 */
export const askTransport = async (query, options = {}) => {
  const data = await apiClient.post("/api/transport/ask", { query }, options);
  return data;
};

/**
 * Get accessibility guidance.
 */
export const getAccessibilityInfo = async (query, options = {}) => {
  const data = await apiClient.post("/api/accessibility", { query }, options);
  return data;
};

/**
 * Get stadium data.
 */
export const getStadiumData = async (options = {}) => {
  const data = await apiClient.get("/api/stadium", options);
  return data;
};

/**
 * Get crowd data.
 */
export const getCrowdData = async (options = {}) => {
  const data = await apiClient.get("/api/crowd", options);
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
