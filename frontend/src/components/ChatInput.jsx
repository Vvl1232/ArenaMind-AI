/**
 * StadiumPilot AI — ChatInput Component
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { HiPaperAirplane, HiLightningBolt } from "react-icons/hi";
import { useChat } from "../hooks/useChat";
import { QUICK_PROMPTS } from "../utils/constants";

const ChatInput = () => {
  const [input, setInput] = useState("");
  const { sendMessage, isLoading } = useChat();
  const [showQuick, setShowQuick] = useState(false);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
    setShowQuick(false);
  }, [input, isLoading, sendMessage]);

  const handleQuickPrompt = useCallback((prompt) => {
    sendMessage(prompt);
    setShowQuick(false);
  }, [sendMessage]);

  return (
    <div className="border-t border-border bg-bg-primary/80 backdrop-blur-xl p-4">
      {/* Quick Prompts */}
      {showQuick && (
        <motion.div
          id="quick-prompts-panel"
          role="region"
          aria-label="Quick Prompts"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 flex flex-wrap gap-2"
        >
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickPrompt(prompt)}
              className="px-3 py-1.5 text-xs rounded-lg bg-bg-secondary border border-border 
                         text-text-muted hover:text-text-primary hover:border-fifa-purple/50 
                         hover:bg-fifa-purple/10 transition-all duration-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple"
            >
              {prompt}
            </button>
          ))}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowQuick(!showQuick)}
          className={`p-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple ${
            showQuick
              ? "bg-fifa-purple/10 text-fifa-purple dark:text-white border border-fifa-purple/20"
              : "bg-bg-secondary border border-border text-text-muted hover:text-text-primary"
          }`}
          title="Quick prompts"
          aria-label="Toggle quick prompts"
          aria-expanded={showQuick}
          aria-controls="quick-prompts-panel"
        >
          <HiLightningBolt className="w-5 h-5" />
        </button>

        <label htmlFor="chat-input" className="sr-only">Ask StadiumPilot AI</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask StadiumPilot AI anything..."
          className="input-field flex-1"
          disabled={isLoading}
        />

        <motion.button
          type="submit"
          disabled={!input.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-xl bg-fifa-gradient text-white shadow-glow 
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                     hover:shadow-glow-magenta transition-shadow
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          aria-label="Send message"
        >
          <HiPaperAirplane className="w-5 h-5 rotate-90" />
        </motion.button>
      </form>
    </div>
  );
};

export default ChatInput;
