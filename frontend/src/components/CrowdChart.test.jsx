/* eslint-disable react/prop-types */
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import CrowdChart from "./CrowdChart";

// Mock recharts because it uses ResizeObserver and SVG which is hard in JSDOM
vi.mock("recharts", () => {
  const OriginalRecharts = vi.importActual("recharts");
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
    BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
    Bar: () => <div data-testid="bar" />,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Cell: () => <div data-testid="cell" />
  };
});

test("CrowdChart renders correctly with data", () => {
  const mockData = {
    zones: [
      { name: "North Stand", occupancy_percent: 80, current_count: 5000, risk_level: "high" },
      { name: "South Stand", occupancy_percent: 40, current_count: 2000, risk_level: "low" },
      { name: "East Stand", occupancy_percent: 60, current_count: 3000, risk_level: "moderate" }
    ]
  };

  render(<CrowdChart data={mockData} />);
  expect(screen.getByText("Zone Occupancy")).toBeInTheDocument();
  expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
  expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
});

test("CrowdChart renders null without data", () => {
  const { container } = render(<CrowdChart data={null} />);
  expect(container.firstChild).toBeNull();
});

test("CrowdChart renders null without zones", () => {
  const { container } = render(<CrowdChart data={{}} />);
  expect(container.firstChild).toBeNull();
});
