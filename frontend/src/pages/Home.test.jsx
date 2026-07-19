import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./Home";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, className, style }) => <div className={className} style={style}>{children}</div>,
      section: ({ children, className }) => <section className={className}>{children}</section>,
      footer: ({ children, className }) => <footer className={className}>{children}</footer>,
    },
  };
});

test("Home renders correctly", () => {
  render(
    <HelmetProvider>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </HelmetProvider>
  );
  
  expect(screen.getByText(/StadiumPilot/)).toBeInTheDocument();
  expect(screen.getByText(/Start Chatting/)).toBeInTheDocument();
  expect(screen.getByText(/View Dashboard/)).toBeInTheDocument();
  expect(screen.getByText(/Stadium Capacity/)).toBeInTheDocument();
});
