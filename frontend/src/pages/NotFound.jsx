/**
 * StadiumPilot AI — 404 Not Found Page
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiHome } from "react-icons/hi";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-[70vh] p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Page Not Found
        </h1>
        <p className="text-text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist. It might have
          been moved or the URL might be incorrect.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fifa-purple focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
        >
          <HiHome className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
