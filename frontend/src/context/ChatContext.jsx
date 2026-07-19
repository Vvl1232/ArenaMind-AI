import PropTypes from "prop-types";
/**
 * StadiumPilot AI — Chat Context
 *
 * Global chat state management with React Context.
 */

import { createContext, useState, useCallback, useRef } from "react";
import { sendChatMessage } from "../services/api";

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 **Welcome to StadiumPilot AI!**\n\nI'm your intelligent assistant for the FIFA World Cup 2026 at StadiumPilot.\n\nI can help you with:\n- 🗺️ **Navigation** — Find gates, food courts, restrooms\n- 🍔 **Food & Drinks** — Options by budget, dietary needs\n- 🏥 **Medical & Safety** — Emergency exits, first aid\n- 🚗 **Transport** — Metro, bus, parking, rideshare\n- ♿ **Accessibility** — Wheelchair routes, accessible facilities\n- 📊 **Crowd Info** — Live density, wait times\n\nAsk me anything!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(async (content) => {
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const data = await sendChatMessage(content, undefined, undefined, { signal: abortControllerRef.current.signal });
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date().toISOString(),
        language: data.language,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "⚠️ **Connection Error**\n\nUnable to reach the AI service. Please ensure the backend server is running and try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages((prev) => [prev[0]]); // Keep welcome message
  }, []);

  return (
    <ChatContext.Provider
      value={{ messages, isLoading, sendMessage, clearMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
