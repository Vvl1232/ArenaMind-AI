import PropTypes from "prop-types";
import { memo } from "react";
import { motion } from "framer-motion";

const PageHeader = ({ title, description, icon }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
      {icon}
      {title}
    </h1>
    <p className="text-sm text-text-muted mt-1">{description}</p>
  </motion.div>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.node,
};

export default memo(PageHeader);
