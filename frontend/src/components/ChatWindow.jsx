/**
 * StadiumPilot AI — ChatWindow Component
 *
 * Displays the chat message history with markdown rendering.
 */

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { HiSparkles, HiUser } from "react-icons/hi";
import { useChat } from "../hooks/useChat";
import Loader from "./Loader";

const ChatWindow = () => {
  const { messages, isLoading } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 lg:px-20 space-y-6 py-6"
      role="log"
      aria-live="polite"
      aria-busy={isLoading}
    >
      {messages.map((msg, index) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="flex gap-4 w-full"
        >
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
              msg.role === "user"
                ? "bg-bg-secondary border border-border"
                : "bg-fifa-gradient shadow-glow-magenta"
            }`}
            aria-label={msg.role === "user" ? "User Avatar" : "AI Avatar"}
            title={msg.role === "user" ? "User" : "StadiumPilot AI"}
          >
            {msg.role === "user" ? (
              <HiUser className="w-4 h-4 text-text-muted" />
            ) : (
              <HiSparkles className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-text-primary text-sm">
                {msg.role === "user" ? "You" : "StadiumPilot AI"}
              </span>
              <span className="text-[10px] text-text-muted">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="markdown-content text-base leading-relaxed text-text-primary">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Loading Indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 w-full"
        >
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full bg-fifa-gradient flex items-center justify-center shadow-glow-magenta mt-1"
            aria-label="AI Avatar Loading"
          >
            <HiSparkles className="w-4 h-4 text-white animate-spin" />
          </div>
          <div className="flex-1 min-w-0 pt-2">
            <Loader text="Analyzing..." />
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
