import PropTypes from "prop-types";
/**
 * StadiumPilot AI — Loader Component
 */

import { motion } from "framer-motion";

const Loader = ({ text = "Thinking...", variant = "default" }) => {
  const isLight = variant === "light";

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${isLight ? "bg-white" : "bg-fifa-purple dark:bg-white"}`}
            animate={{
              y: [0, -8, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      {text && (
        <span
          className={`text-xs font-medium ${isLight ? "text-white/90" : "text-text-muted"}`}
        >
          {text}
        </span>
      )}
    </div>
  );
};

Loader.propTypes = { text: PropTypes.string, variant: PropTypes.string };

export default Loader;
