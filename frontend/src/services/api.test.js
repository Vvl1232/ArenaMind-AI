import { expect, test, vi, beforeEach } from "vitest";
import * as api from "./api";
import apiClient from "../utils/apiClient";

vi.mock("../utils/apiClient", () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
    }
  };
});

beforeEach(() => {
  vi.restoreAllMocks();
});

test("getCrowdData calls apiClient with options", async () => {
  apiClient.get.mockResolvedValue({ crowd: "data" });
  const result = await api.getCrowdData({ signal: "abort" });
  expect(apiClient.get).toHaveBeenCalledWith("/api/crowd", { signal: "abort" });
  expect(result).toEqual({ crowd: "data" });
});

test("getStadiumData calls apiClient with options", async () => {
  apiClient.get.mockResolvedValue({ stadium: "data" });
  const result = await api.getStadiumData({ signal: "abort" });
  expect(apiClient.get).toHaveBeenCalledWith("/api/stadium", { signal: "abort" });
  expect(result).toEqual({ stadium: "data" });
});

test("sendChatMessage calls apiClient", async () => {
  apiClient.post.mockResolvedValue({ response: "AI reply" });
  const result = await api.sendChatMessage("hello", "nav", { some: "data" }, { signal: "signal" });
  
  expect(apiClient.post).toHaveBeenCalledWith("/api/chat", {
    message: "hello",
    language: "nav",
    context: { some: "data" },
  }, { signal: "signal" });
  expect(result).toEqual({ response: "AI reply" });
});

test("getNavigation calls apiClient", async () => {
  apiClient.post.mockResolvedValue({ path: "data" });
  const result = await api.getNavigation("A", "B", true);
  expect(apiClient.post).toHaveBeenCalledWith("/api/navigate", {
    origin: "A",
    destination: "B",
    accessible: true,
  }, {});
  expect(result).toEqual({ path: "data" });
});

test("getOperationsRecommendation calls apiClient", async () => {
  apiClient.post.mockResolvedValue({ response: "ok" });
  const result = await api.getOperationsRecommendation("scenario1", "high", "zone1");
  expect(apiClient.post).toHaveBeenCalledWith("/api/operations", {
    scenario: "scenario1",
    priority: "high",
    zone: "zone1",
  }, {});
  expect(result).toEqual({ response: "ok" });
});

test("getTransportData calls apiClient", async () => {
  apiClient.get.mockResolvedValue({ transport: "data" });
  const result = await api.getTransportData();
  expect(apiClient.get).toHaveBeenCalledWith("/api/transport", {});
  expect(result).toEqual({ transport: "data" });
});

test("askTransport calls apiClient", async () => {
  apiClient.post.mockResolvedValue({ response: "ok" });
  const result = await api.askTransport("query");
  expect(apiClient.post).toHaveBeenCalledWith("/api/transport/ask", { query: "query" }, {});
  expect(result).toEqual({ response: "ok" });
});

test("getAccessibilityInfo calls apiClient", async () => {
  apiClient.post.mockResolvedValue({ response: "ok" });
  const result = await api.getAccessibilityInfo("query");
  expect(apiClient.post).toHaveBeenCalledWith("/api/accessibility", { query: "query" }, {});
  expect(result).toEqual({ response: "ok" });
});

test("healthCheck calls apiClient", async () => {
  apiClient.get.mockResolvedValue({ status: "ok" });
  const result = await api.healthCheck();
  expect(apiClient.get).toHaveBeenCalledWith("/api/health");
  expect(result).toEqual({ status: "ok" });
});
