import PropTypes from "prop-types";
import { memo } from "react";
import { motion } from "framer-motion";
import AccessibilityCard from "./AccessibilityCard";

const FacilityList = ({ title, items, type, delay }) => {
  if (!items || items.length === 0) return null;
  return (
    <motion.section
      aria-label={title}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <h3 className="text-lg font-bold text-text-primary mb-3">
        {title} ({items.length})
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <AccessibilityCard
            key={item.id}
            facility={item}
            type={type}
            delay={0.05 * i}
          />
        ))}
      </div>
    </motion.section>
  );
};

FacilityList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  delay: PropTypes.number.isRequired,
};

export default memo(FacilityList);
