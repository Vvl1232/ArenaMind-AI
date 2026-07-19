import PropTypes from "prop-types";
import { memo } from "react";
import { motion } from "framer-motion";

const AnimatedCard = ({ delay = 0, className = "glass-card-hover p-4", children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

AnimatedCard.propTypes = {
  delay: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default memo(AnimatedCard);
