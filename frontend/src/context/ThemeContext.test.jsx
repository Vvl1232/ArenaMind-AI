import { renderHook, act } from "@testing-library/react";
import { expect, test, beforeEach } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = "";
});

test("ThemeContext provides default theme based on localStorage", () => {
  localStorage.setItem("stadiumpilot-theme", "dark");
  const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
  const { result } = renderHook(() => useTheme(), { wrapper });
  
  expect(result.current.theme).toBe("dark");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});

test("ThemeContext toggleTheme switches theme", () => {
  const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
  const { result } = renderHook(() => useTheme(), { wrapper });
  
  // Default without localStorage or matchMedia is light
  expect(result.current.theme).toBe("light");
  
  act(() => {
    result.current.toggleTheme();
  });
  
  expect(result.current.theme).toBe("dark");
  expect(localStorage.getItem("stadiumpilot-theme")).toBe("dark");
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  
  act(() => {
    result.current.toggleTheme();
  });
  
  expect(result.current.theme).toBe("light");
  expect(localStorage.getItem("stadiumpilot-theme")).toBe("light");
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});
