import PropTypes from "prop-types";
import { memo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

const AiResponseCard = ({ response, title, icon }) => {
  if (!response) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
      aria-live="polite"
    >
      <h3 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <div className="markdown-content text-sm leading-relaxed text-text-primary">
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
    </motion.div>
  );
};

AiResponseCard.propTypes = {
  response: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
};

export default memo(AiResponseCard);
