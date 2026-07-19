import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi, beforeEach } from "vitest";
import ChatInput from "./ChatInput";
import { useChat } from "../hooks/useChat";

vi.mock("../hooks/useChat", () => ({
  useChat: vi.fn()
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test("ChatInput renders correctly", () => {
  useChat.mockReturnValue({ sendMessage: vi.fn(), isLoading: false });
  render(<ChatInput />);
  expect(screen.getByPlaceholderText(/Ask StadiumPilot AI anything/i)).toBeInTheDocument();
});

test("ChatInput toggles quick prompts and sends one", () => {
  const sendMessage = vi.fn();
  useChat.mockReturnValue({ sendMessage, isLoading: false });
  
  render(<ChatInput />);
  
  const toggleBtn = screen.getByLabelText("Toggle quick prompts");
  fireEvent.click(toggleBtn);
  
  const quickPromptBtn = screen.getByText("Where is Gate B12?");
  fireEvent.click(quickPromptBtn);
  
  expect(sendMessage).toHaveBeenCalledWith("Where is Gate B12?");
});

test("ChatInput does not send empty message", () => {
  const sendMessage = vi.fn();
  useChat.mockReturnValue({ sendMessage, isLoading: false });
  
  render(<ChatInput />);
  
  const submitBtn = screen.getByLabelText("Send message");
  fireEvent.click(submitBtn);
  
  expect(sendMessage).not.toHaveBeenCalled();
});

test("ChatInput is disabled while loading", () => {
  const sendMessage = vi.fn();
  useChat.mockReturnValue({ sendMessage, isLoading: true });
  
  render(<ChatInput />);
  
  const input = screen.getByPlaceholderText(/Ask StadiumPilot AI anything/i);
  const submitBtn = screen.getByLabelText("Send message");
  
  expect(input).toBeDisabled();
  expect(submitBtn).toBeDisabled();
});
