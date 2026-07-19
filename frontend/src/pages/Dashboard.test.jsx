/* eslint-disable react/prop-types */
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi, beforeEach } from "vitest";
import Dashboard from "./Dashboard";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  getCrowdData: vi.fn(),
}));

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, className }) => <div className={className}>{children}</div>,
    },
  };
});

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  AreaChart: () => <div>AreaChart</div>,
  Area: () => <div>Area</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
  Tooltip: () => <div>Tooltip</div>,
}));

beforeEach(() => {
  vi.restoreAllMocks();
});

test("Dashboard renders skeleton initially then loads data", async () => {
  api.getCrowdData.mockResolvedValue({
    overall: { total_attendance: 50000, risk_level: "low", occupancy_percent: 60, ingress_rate_per_min: 100 },
    zones: [{ zone_id: "Z1", name: "North Zone", risk_level: "low", current_count: 10000, capacity: 15000, occupancy_percent: 66, wait_time_entry_min: 5, temperature_celsius: 22, recommendation: "All good" }],
    hotspots: [{ location: "Gate A", severity: "low", density: 0.5, action_required: "None" }],
    incidents: [{ type: "medical", zone_id: "Z1", location: "Gate A", severity: "high", description: "Heat exhaustion", timestamp: "2026-06-11T14:30:00Z" }],
    predictions: [],
  });

  render(<Dashboard />);
  
  await waitFor(() => {
    expect(screen.getByText("Operations Dashboard")).toBeInTheDocument();
  });
  
  expect(screen.getByText("50,000")).toBeInTheDocument();
  expect(screen.getByText("North Zone")).toBeInTheDocument();
  expect(screen.getByText("All good")).toBeInTheDocument();
  expect(screen.getByText("Gate A")).toBeInTheDocument();
});

test("Dashboard renders error state", async () => {
  api.getCrowdData.mockRejectedValue(new Error("Network Error"));

  render(<Dashboard />);
  
  await waitFor(() => {
    expect(screen.getByText("Operations Dashboard")).toBeInTheDocument();
  });
  
  const placeholders = screen.getAllByText("—");
  expect(placeholders.length).toBeGreaterThan(0);
});
