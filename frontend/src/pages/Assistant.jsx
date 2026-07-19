/**
 * StadiumPilot AI — Assistant Page
 */

import { motion } from "framer-motion";
import { HiTrash } from "react-icons/hi";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import { useChat } from "../hooks/useChat";

const Assistant = () => {
  const { clearMessages } = useChat();

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]" role="region" aria-label="AI Stadium Assistant">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-primary/80 backdrop-blur-xl"
      >
        <div>
          <h1 className="text-lg font-bold text-text-primary flex items-center gap-2">
            🤖 AI Stadium Assistant
          </h1>
          <p className="text-xs text-text-muted">
            Powered by Groq — Ask about gates, food, navigation, emergencies,
            and more
          </p>
        </div>
        <button
          onClick={clearMessages}
          className="p-2 rounded-lg hover:bg-card-hover text-text-muted hover:text-red-600 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple"
          title="Clear chat"
          aria-label="Clear chat history"
        >
          <HiTrash className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Chat Area */}
      <ChatWindow />
      <ChatInput />
    </div>
  );
};

export default Assistant;
