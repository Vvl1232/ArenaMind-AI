import PropTypes from "prop-types";
import { memo } from "react";
import { motion } from "framer-motion";
import { HiPaperAirplane } from "react-icons/hi";
import Loader from "./Loader";

const AiAskForm = ({
  query,
  setQuery,
  asking,
  handleAsk,
  placeholder = "Ask AI...",
  quickQuestions = [],
  onQuickQuestion,
  buttonText = "Ask AI",
}) => {
  return (
    <motion.form
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      onSubmit={handleAsk}
      className={`glass-card p-4 ${quickQuestions.length > 0 ? "space-y-3" : "flex gap-2"}`}
    >
      <div className={`${quickQuestions.length > 0 ? "flex gap-2" : "flex-1 flex gap-2 w-full"}`}>
        <label htmlFor="ai-ask-input" className="sr-only">{placeholder}</label>
        <input
          id="ai-ask-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="input-field flex-1 w-full"
        />
        <button
          type="submit"
          disabled={!query.trim() || asking}
          className="btn-primary flex items-center gap-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
        >
          {asking ? (
            <Loader text="" variant="light" />
          ) : (
            <HiPaperAirplane className="w-4 h-4 rotate-90" />
          )}
          <span className="hidden sm:inline">{buttonText}</span>
        </button>
      </div>
      
      {quickQuestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onQuickQuestion?.(q)}
              className="px-3 py-1.5 text-xs rounded-lg bg-bg-secondary border border-border 
                         text-text-muted hover:text-text-primary hover:border-pink-500/50 
                         hover:bg-pink-500/10 transition-all duration-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </motion.form>
  );
};

AiAskForm.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  asking: PropTypes.bool.isRequired,
  handleAsk: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  quickQuestions: PropTypes.arrayOf(PropTypes.string),
  onQuickQuestion: PropTypes.func,
  buttonText: PropTypes.string,
};

export default memo(AiAskForm);
