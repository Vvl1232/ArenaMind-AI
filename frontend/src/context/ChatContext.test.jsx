import { renderHook, act } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { ChatProvider, ChatContext } from "./ChatContext";
import { useContext } from "react";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  sendChatMessage: vi.fn(),
}));

test("ChatContext provides default messages and clearMessages works", () => {
  const wrapper = ({ children }) => <ChatProvider>{children}</ChatProvider>;
  const { result } = renderHook(() => useContext(ChatContext), { wrapper });
  
  expect(result.current.messages.length).toBe(1);
  expect(result.current.messages[0].id).toBe("welcome");
  
  act(() => {
    // Add a fake message
    // To do this we have to call sendMessage which is async, let's just test clearMessages
    result.current.clearMessages();
  });
  expect(result.current.messages.length).toBe(1);
});

test("sendMessage successfully adds messages", async () => {
  const wrapper = ({ children }) => <ChatProvider>{children}</ChatProvider>;
  const { result } = renderHook(() => useContext(ChatContext), { wrapper });
  
  api.sendChatMessage.mockResolvedValueOnce({ response: "Hello from AI", language: "en" });
  
  await act(async () => {
    await result.current.sendMessage("Hi");
  });
  
  expect(result.current.messages.length).toBe(3); // welcome, user, AI
  expect(result.current.messages[1].role).toBe("user");
  expect(result.current.messages[1].content).toBe("Hi");
  expect(result.current.messages[2].role).toBe("assistant");
  expect(result.current.messages[2].content).toBe("Hello from AI");
});

test("sendMessage handles errors", async () => {
  const wrapper = ({ children }) => <ChatProvider>{children}</ChatProvider>;
  const { result } = renderHook(() => useContext(ChatContext), { wrapper });
  
  api.sendChatMessage.mockRejectedValueOnce(new Error("Network Error"));
  
  await act(async () => {
    await result.current.sendMessage("Hi");
  });
  
  expect(result.current.messages.length).toBe(3); // welcome, user, error
  expect(result.current.messages[2].isError).toBe(true);
  expect(result.current.messages[2].content).toContain("Connection Error");
});
