import PropTypes from "prop-types";
/**
 * StadiumPilot AI — TransportCard Component
 */

import { memo } from "react";
import AnimatedCard from "./AnimatedCard";
import { HiClock, HiLocationMarker, HiCurrencyDollar } from "react-icons/hi";

const statusColors = {
  running: "badge-success",
  available: "badge-success",
  surge_pricing: "badge-warning",
  delayed: "badge-danger",
  closed: "badge-danger",
};

const TransportCard = ({ item, type, delay = 0 }) => {
  const name = item.line || item.route || item.service || item.name;
  const location =
    item.station || item.stop || item.location || item.pickup_zone;
  const status = item.status || "unknown";
  const waitTime = item.estimated_wait_min || item.frequency_min;
  const fare = item.fare || item.estimated_fare_to_nyc;
  const accessible = item.accessible || item.accessible_vehicles;

  const typeIcons = {
    metro: "🚇",
    bus: "🚌",
    taxi: "🚕",
    rideshare: "🚗",
    walking: "🚶",
  };

  return (
    <AnimatedCard delay={delay}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[type] || "🚌"}</span>
          <div>
            <h4 className="text-sm font-semibold text-text-primary">{name}</h4>
            <p className="text-xs text-text-muted flex items-center gap-1">
              <HiLocationMarker className="w-3 h-3" />
              {location}
            </p>
          </div>
        </div>
        <span className={statusColors[status] || "badge-info"}>
          {status.replace("_", " ")}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1 text-text-muted">
          <HiClock className="w-3.5 h-3.5 text-fifa-teal" />
          <span>{waitTime ? `${waitTime} min` : "N/A"}</span>
        </div>
        <div className="flex items-center gap-1 text-text-muted">
          <HiCurrencyDollar className="w-3.5 h-3.5 text-fifa-gold" />
          <span>{fare || "N/A"}</span>
        </div>
        <div className="flex items-center gap-1 text-text-muted">
          <span>{accessible ? "♿ Yes" : "♿ No"}</span>
        </div>
      </div>

      {item.notes && (
        <p className="text-xs text-text-muted mt-2 pt-2 border-t border-border">
          {item.notes}
        </p>
      )}
    </AnimatedCard>
  );
};

TransportCard.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

export default memo(TransportCard);
