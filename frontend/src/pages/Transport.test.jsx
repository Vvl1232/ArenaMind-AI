import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, test, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Transport from "./Transport";
import { useFetchData } from "../hooks/useFetchData";
import { askTransport } from "../services/api";

vi.mock("../hooks/useFetchData", () => ({
  useFetchData: vi.fn()
}));

vi.mock("../services/api", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    askTransport: vi.fn()
  };
});

vi.mock("../components/TransportCard", () => ({
  default: ({ item, type }) => (
    <div data-testid={`transport-card-${type}`}>
      {item.name}
    </div>
  )
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("Transport page renders loading", () => {
  useFetchData.mockReturnValue({ data: null, loading: true, error: null });
  const { container } = render(<HelmetProvider><BrowserRouter><Transport /></BrowserRouter></HelmetProvider>);
  expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
});

test("Transport page renders data", () => {
  useFetchData.mockReturnValue({
    data: {
      metro: [{ id: "M1", name: "Metro 1" }],
      bus: [{ id: "B1", name: "Bus 1" }]
    },
    loading: false,
    error: null
  });

  render(<HelmetProvider><BrowserRouter><Transport /></BrowserRouter></HelmetProvider>);
  
  expect(screen.getAllByText(/metro/i)[0]).toBeInTheDocument();
  expect(screen.getByTestId("transport-card-metro")).toBeInTheDocument();
});

test("Transport handles AI ask success", async () => {
  useFetchData.mockReturnValue({ data: null, loading: false, error: null });
  askTransport.mockResolvedValue({ response: "AI transport advice" });
  
  render(<HelmetProvider><BrowserRouter><Transport /></BrowserRouter></HelmetProvider>);
  
  const input = screen.getByPlaceholderText(/Ask about transport/i);
  fireEvent.change(input, { target: { value: "How to get to stadium?" } });
  
  const btn = screen.getByRole("button", { name: /ask ai/i });
  fireEvent.click(btn);
  
  await waitFor(() => {
    expect(askTransport).toHaveBeenCalledWith("How to get to stadium?");
  });
  
  expect(await screen.findByText("AI transport advice")).toBeInTheDocument();
});

test("Transport handles AI ask error", async () => {
  useFetchData.mockReturnValue({ data: null, loading: false, error: null });
  askTransport.mockRejectedValue(new Error("API Error"));
  
  render(<HelmetProvider><BrowserRouter><Transport /></BrowserRouter></HelmetProvider>);
  
  const input = screen.getByPlaceholderText(/Ask about transport/i);
  fireEvent.change(input, { target: { value: "How to get to stadium?" } });
  
  const btn = screen.getByRole("button", { name: /ask ai/i });
  fireEvent.click(btn);
  
  expect(await screen.findByText(/Failed to get transport guidance/i)).toBeInTheDocument();
});
