import PropTypes from "prop-types";
/**
 * StadiumPilot AI — FeatureCard Component (used on Home page)
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FeatureCard = ({
  title,
  description,
  icon,
  link,
  color = "purple",
  delay = 0,
}) => {
  const colorMap = {
    purple:
      "from-fifa-purple/20 to-transparent border-fifa-purple/20 hover:border-fifa-purple/50",
    magenta:
      "from-pink-500/20 to-transparent border-pink-500/20 hover:border-pink-500/50",
    teal: "from-fifa-teal/20 to-transparent border-fifa-teal/20 hover:border-fifa-teal/50",
    gold: "from-amber-500/20 to-transparent border-amber-500/20 hover:border-amber-500/50",
    green:
      "from-emerald-500/20 to-transparent border-emerald-500/20 hover:border-emerald-500/50",
    red: "from-red-500/20 to-transparent border-red-500/20 hover:border-red-500/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={link}
        className={`block p-6 rounded-2xl bg-gradient-to-br ${colorMap[color]} border backdrop-blur-sm transition-all duration-300 h-full`}
      >
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="text-lg font-bold text-black dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      </Link>
    </motion.div>
  );
};

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  link: PropTypes.string.isRequired,
  color: PropTypes.string,
  delay: PropTypes.number,
};

export default memo(FeatureCard);
