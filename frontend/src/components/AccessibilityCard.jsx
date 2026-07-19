import PropTypes from "prop-types";
/**
 * StadiumPilot AI — AccessibilityCard Component
 */

import { memo } from "react";
import AnimatedCard from "./AnimatedCard";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

const AccessibilityCard = ({ facility, type, delay = 0 }) => {
  const typeLabels = {
    restroom: "🚻 Restroom",
    medical: "🏥 Medical",
    gate: "🚪 Gate",
    volunteer: "🙋 Volunteer Station",
  };

  return (
    <AnimatedCard delay={delay}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-xs text-text-muted mb-0.5">
            {typeLabels[type] || type}
          </p>
          <h4 className="text-sm font-semibold text-text-primary">
            {facility.name}
          </h4>
        </div>
        {facility.accessible !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs ${facility.accessible ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {facility.accessible ? (
              <HiCheckCircle className="w-4 h-4" />
            ) : (
              <HiXCircle className="w-4 h-4" />
            )}
            <span>{facility.accessible ? "Accessible" : "Not Accessible"}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-text-muted">
        <span className="px-2 py-0.5 rounded-full bg-bg-secondary border border-border">
          Zone: {facility.zone}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-bg-secondary border border-border">
          Floor {facility.floor}
        </span>
        {facility.wait_time_min !== undefined && (
          <span className="px-2 py-0.5 rounded-full bg-bg-secondary border border-border">
            Wait: {facility.wait_time_min} min
          </span>
        )}
        {facility.family_room && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            Family Room
          </span>
        )}
      </div>

      {facility.services && (
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs text-text-muted">
            Services: {facility.services.join(", ")}
          </p>
        </div>
      )}
    </AnimatedCard>
  );
};

AccessibilityCard.propTypes = {
  facility: PropTypes.object.isRequired,
  type: PropTypes.string,
  delay: PropTypes.number,
};

export default memo(AccessibilityCard);
