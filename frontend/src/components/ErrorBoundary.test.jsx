/* eslint-disable react/prop-types */
import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi, beforeEach } from "vitest";
import ErrorBoundary from "./ErrorBoundary";

const ProblemChild = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>Safe</div>;
};

beforeEach(() => {
  // Suppress console.error in tests
  vi.spyOn(console, "error").mockImplementation(() => {});
});

test("ErrorBoundary catches error and renders fallback UI", () => {
  render(
    <ErrorBoundary>
      <ProblemChild shouldThrow={true} />
    </ErrorBoundary>
  );
  
  expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
  expect(screen.getByText("Refresh Page")).toBeInTheDocument();
});

test("ErrorBoundary renders children when no error", () => {
  render(
    <ErrorBoundary>
      <ProblemChild shouldThrow={false} />
    </ErrorBoundary>
  );
  
  expect(screen.getByText("Safe")).toBeInTheDocument();
});

test("ErrorBoundary refresh button reloads window", () => {
  const originalLocation = window.location;
  delete window.location;
  window.location = { reload: vi.fn() };
  
  render(
    <ErrorBoundary>
      <ProblemChild shouldThrow={true} />
    </ErrorBoundary>
  );
  
  fireEvent.click(screen.getByText("Refresh Page"));
  expect(window.location.reload).toHaveBeenCalled();
  
  window.location = originalLocation;
});
