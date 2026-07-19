import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, test, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Operations from "./Operations";
import { getOperationsRecommendation } from "../services/api";

vi.mock("../services/api", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getOperationsRecommendation: vi.fn()
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

test("Operations page renders initial state", () => {
  render(<HelmetProvider><BrowserRouter><Operations /></BrowserRouter></HelmetProvider>);
  
  expect(screen.getByText("Operations Copilot")).toBeInTheDocument();
  expect(screen.getByText("Medical Emergency")).toBeInTheDocument();
  expect(screen.getByText("Get AI Recommendations")).toBeInTheDocument();
});

test("Operations page selects preset and submits", async () => {
  getOperationsRecommendation.mockResolvedValue({ response: "AI operational advice" });

  render(<HelmetProvider><BrowserRouter><Operations /></BrowserRouter></HelmetProvider>);
  
  const presetBtn = screen.getByText("Medical Emergency");
  fireEvent.click(presetBtn);

  const submitBtn = screen.getByText("Get AI Recommendations");
  fireEvent.click(submitBtn);

  await waitFor(() => {
    expect(getOperationsRecommendation).toHaveBeenCalledWith(
      "Multiple fans reporting heat exhaustion in the East Stand. Temperature is 29°C. Need emergency response plan.",
      "critical",
      "East"
    );
  });

  expect(await screen.findByText("AI operational advice")).toBeInTheDocument();
});

test("Operations page handles API error", async () => {
  getOperationsRecommendation.mockRejectedValue(new Error("API Error"));

  render(<HelmetProvider><BrowserRouter><Operations /></BrowserRouter></HelmetProvider>);
  
  const input = screen.getByPlaceholderText(/Describe the operational scenario/i);
  fireEvent.change(input, { target: { value: "Custom emergency" } });

  const submitBtn = screen.getByText("Get AI Recommendations");
  fireEvent.click(submitBtn);

  expect(await screen.findByText(/Failed to get operational recommendations/i)).toBeInTheDocument();
});
