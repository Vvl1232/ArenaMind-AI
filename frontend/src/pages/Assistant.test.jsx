import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import Assistant from "./Assistant";
import { ChatContext } from "../context/ChatContext";

vi.mock("../components/AiAskForm", () => ({
  default: ({ onAsk, isLoading }) => (
    <div data-testid="ai-ask-form">
      <button 
        data-testid="submit-btn" 
        onClick={() => onAsk("Test question")}
        disabled={isLoading}
      >
        Submit
      </button>
    </div>
  )
}));

vi.mock("../components/AiResponseCard", () => ({
  default: ({ message, isError }) => (
    <div data-testid="ai-response-card" data-error={isError}>
      {message}
    </div>
  )
}));

test("Assistant renders messages and can send", () => {
  const sendMessage = vi.fn();
  const clearMessages = vi.fn();
  const messages = [
    { id: "1", role: "assistant", content: "Welcome" },
    { id: "2", role: "user", content: "Test question" }
  ];
  
  render(
    <ChatContext.Provider value={{ messages, isLoading: false, sendMessage, clearMessages }}>
      <Assistant />
    </ChatContext.Provider>
  );
  
  expect(screen.getByText("Welcome")).toBeInTheDocument();
  
  const input = screen.getByPlaceholderText(/Ask StadiumPilot AI anything.../i);
  fireEvent.change(input, { target: { value: "Test question" } });
  
  const submitBtn = screen.getByLabelText("Send message");
  fireEvent.click(submitBtn);
  
  expect(sendMessage).toHaveBeenCalledWith("Test question");
});

test("Assistant handles clear chat", () => {
  const sendMessage = vi.fn();
  const clearMessages = vi.fn();
  const messages = [
    { id: "1", role: "assistant", content: "Welcome" }
  ];
  
  render(
    <ChatContext.Provider value={{ messages, isLoading: false, sendMessage, clearMessages }}>
      <Assistant />
    </ChatContext.Provider>
  );
  
  const clearBtn = screen.getByLabelText("Clear chat history");
  fireEvent.click(clearBtn);
  
  expect(clearMessages).toHaveBeenCalled();
});
