import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, test, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Accessibility from "./Accessibility";
import { useFetchData } from "../hooks/useFetchData";
import { getAccessibilityInfo } from "../services/api";

vi.mock("../hooks/useFetchData", () => ({
  useFetchData: vi.fn()
}));

vi.mock("../services/api", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getAccessibilityInfo: vi.fn()
  };
});

vi.mock("../components/FacilityList", () => ({
  default: ({ facilities, renderItem }) => (
    <div data-testid="facility-list">
      {facilities?.map(renderItem)}
    </div>
  )
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("Accessibility page shows loading", () => {
  useFetchData.mockReturnValue({ data: null, loading: true, error: null });
  const { container } = render(<HelmetProvider><BrowserRouter><Accessibility /></BrowserRouter></HelmetProvider>);
  expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
});

test("Accessibility page renders data", () => {
  useFetchData.mockReturnValue({
    data: {
      gates: [{ id: "1", accessible: true, name: "Gate 1", zone: "North", wait_time_min: 0, status: "open" }],
      medical: [{ id: "2", name: "Medical 1", zone: "East", floor: 1, services: ["First Aid"] }],
      restrooms: [{ id: "3", accessible: true, name: "Restroom 1", zone: "South", wait_time_min: 2, floor: 1 }],
      accessibility_facilities: {
        elevators: [{ id: "E1", name: "Elevator 1", status: "operational", zone: "North", wait_time_min: 1, floors: [1,2] }],
        sensory_rooms: [{ id: "S1", name: "Sensory Room", status: "operational", zone: "West", capacity: 10, current_occupancy: 2 }]
      }
    },
    loading: false,
    error: null
  });

  render(<HelmetProvider><BrowserRouter><Accessibility /></BrowserRouter></HelmetProvider>);
  
  expect(screen.getByText("Accessibility Support")).toBeInTheDocument();
  expect(screen.getAllByTestId("facility-list").length).toBeGreaterThan(0);
});

test("Accessibility handles AI ask success", async () => {
  useFetchData.mockReturnValue({ data: null, loading: false, error: null });
  getAccessibilityInfo.mockResolvedValue({ response: "AI advice" });
  
  render(<HelmetProvider><BrowserRouter><Accessibility /></BrowserRouter></HelmetProvider>);
  
  const input = screen.getByPlaceholderText(/Ask about accessibility/i);
  fireEvent.change(input, { target: { value: "Where is the restroom?" } });
  
  const btn = screen.getByRole("button", { name: /^ask$/i });
  fireEvent.click(btn);
  
  await waitFor(() => {
    expect(getAccessibilityInfo).toHaveBeenCalledWith("Where is the restroom?");
  });
  
  expect(await screen.findByText("AI advice")).toBeInTheDocument();
});

test("Accessibility handles AI ask error", async () => {
  useFetchData.mockReturnValue({ data: null, loading: false, error: null });
  getAccessibilityInfo.mockRejectedValue(new Error("API Error"));
  
  render(<HelmetProvider><BrowserRouter><Accessibility /></BrowserRouter></HelmetProvider>);
  
  const input = screen.getByPlaceholderText(/Ask about accessibility/i);
  fireEvent.change(input, { target: { value: "Where is the restroom?" } });
  
  const btn = screen.getByRole("button", { name: /^ask$/i });
  fireEvent.click(btn);
  
  expect(await screen.findByText(/Failed to get accessibility guidance/i)).toBeInTheDocument();
});

test("Accessibility handles quick questions success", async () => {
  useFetchData.mockReturnValue({ data: null, loading: false, error: null });
  getAccessibilityInfo.mockResolvedValue({ response: "Quick answer" });
  
  render(<HelmetProvider><BrowserRouter><Accessibility /></BrowserRouter></HelmetProvider>);
  
  const qBtn = screen.getByText("Where can I find medical assistance?");
  fireEvent.click(qBtn);
  
  expect(await screen.findByText("Quick answer")).toBeInTheDocument();
});

test("Accessibility handles quick questions error", async () => {
  useFetchData.mockReturnValue({ data: null, loading: false, error: null });
  getAccessibilityInfo.mockRejectedValue(new Error("Network Error"));
  
  render(<HelmetProvider><BrowserRouter><Accessibility /></BrowserRouter></HelmetProvider>);
  
  const qBtn = screen.getByText("Where can I find medical assistance?");
  fireEvent.click(qBtn);
  
  expect(await screen.findByText(/Failed to get accessibility guidance/i)).toBeInTheDocument();
});
