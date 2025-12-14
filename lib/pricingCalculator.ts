import {
  TaskCategory,
  Location,
  Pricing,
  FuelDeliveryDetails,
  QueueStandingDetails,
  PickupDeliveryDetails,
  GeneralTaskDetails,
  TaskDetails,
} from "@/types";
import { PRICING_CONSTANTS } from "./mockData";

export function calculateDistance(locations: Location[]): number {
  if (locations.length < 2) {
    // For single location, use a mock distance from "tasker's starting point"
    return Math.round((Math.random() * 5 + 2) * 10) / 10; // 2-7 km
  }

  let totalDistance = 0;

  for (let i = 0; i < locations.length - 1; i++) {
    const from = locations[i];
    const to = locations[i + 1];
    totalDistance += haversineDistance(from.lat, from.lng, to.lat, to.lng);
  }

  return Math.round(totalDistance * 10) / 10;
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function calculatePricing(
  category: TaskCategory,
  locations: Location[],
  details: TaskDetails | null
): Pricing {
  if (category === "FUEL_DELIVERY" || category === "PICKUP_DELIVERY") {
    return calculateDistanceBasedPricing(category, locations);
  } else {
    return calculateTimeBasedPricing(category, details);
  }
}

function calculateDistanceBasedPricing(
  category: "FUEL_DELIVERY" | "PICKUP_DELIVERY",
  locations: Location[]
): Pricing {
  const constants = PRICING_CONSTANTS[category];
  const distance = calculateDistance(locations);

  const distanceCost = Math.round(distance * constants.perKm);
  const total = constants.baseFare + distanceCost + constants.serviceFee;

  return {
    baseFare: constants.baseFare,
    distanceCost,
    serviceFee: constants.serviceFee,
    total,
    distance,
  };
}

function calculateTimeBasedPricing(
  category: "QUEUE_STANDING" | "GENERAL_TASK",
  details: TaskDetails | null
): Pricing {
  const constants = PRICING_CONSTANTS[category];

  let hours = constants.minimumHours;

  if (details) {
    if (category === "QUEUE_STANDING") {
      hours =
        (details as QueueStandingDetails).estimatedHours ||
        constants.minimumHours;
    } else if (category === "GENERAL_TASK") {
      hours =
        (details as GeneralTaskDetails).estimatedDuration ||
        constants.minimumHours;
    }
  }

  hours = Math.max(hours, constants.minimumHours);

  const timeCost = Math.round(hours * constants.perHour);
  const total = timeCost + constants.serviceFee;

  return {
    baseFare: 0,
    timeCost,
    serviceFee: constants.serviceFee,
    total,
    duration: hours,
  };
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
