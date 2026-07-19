import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import MainLayout from "./MainLayout";

vi.mock("../components/Navbar", () => ({
  default: ({ onToggleSidebar }) => (
    <div data-testid="navbar">
      <button data-testid="menu-btn" onClick={onToggleSidebar}>Menu</button>
    </div>
  )
}));

vi.mock("../components/Sidebar", () => ({
  default: ({ isOpen, onClose }) => (
    <div data-testid="sidebar" data-open={isOpen}>
      <button data-testid="close-btn" onClick={onClose}>Close</button>
    </div>
  )
}));

test("MainLayout toggles sidebar", () => {
  render(
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
  
  const sidebar = screen.getByTestId("sidebar");
  expect(sidebar.getAttribute("data-open")).toBe("false");
  
  fireEvent.click(screen.getByTestId("menu-btn"));
  expect(sidebar.getAttribute("data-open")).toBe("true");
  
  fireEvent.click(screen.getByTestId("close-btn"));
  expect(sidebar.getAttribute("data-open")).toBe("false");
});
