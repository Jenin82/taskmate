export type TaskCategory =
  | "FUEL_DELIVERY"
  | "QUEUE_STANDING"
  | "PICKUP_DELIVERY"
  | "GENERAL_TASK";

export type LocationType = "pickup" | "dropoff" | "general";

export interface Location {
  id: string;
  address: string;
  lat: number;
  lng: number;
  type: LocationType;
}

export interface FuelDeliveryDetails {
  fuelType: "petrol" | "diesel";
  quantity: number;
  timePreference: "asap" | "scheduled";
  scheduledTime?: Date;
}

export interface QueueStandingDetails {
  estimatedHours: number;
  taskDescription: string;
  additionalInstructions: string;
}

export interface PickupDeliveryDetails {
  locationType: "single" | "two" | "multiple";
  packageSize: "small" | "medium" | "large";
  specialInstructions: string;
}

export interface GeneralTaskDetails {
  estimatedDuration: number;
  detailedDescription: string;
  needsMultipleLocations: boolean;
}

export type TaskDetails =
  | FuelDeliveryDetails
  | QueueStandingDetails
  | PickupDeliveryDetails
  | GeneralTaskDetails;

export interface Pricing {
  baseFare: number;
  distanceCost?: number;
  timeCost?: number;
  serviceFee: number;
  total: number;
  distance?: number;
  duration?: number;
}

export interface Tasker {
  id: string;
  name: string;
  phone: string;
  rating: number;
  avatar: string;
  currentLocation: { lat: number; lng: number };
  vehicleType: string;
}

export type TaskStatus =
  | "DRAFT"
  | "REQUESTED"
  | "ASSIGNED"
  | "EN_ROUTE"
  | "ARRIVED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Task {
  id: string;
  description: string;
  category: TaskCategory;
  locations: Location[];
  details: TaskDetails | null;
  pricing: Pricing | null;
  tasker: Tasker | null;
  status: TaskStatus;
  createdAt: Date;
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  status: TaskStatus;
  title: string;
  timestamp: Date | null;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface TaskTemplate {
  id: string;
  emoji: string;
  title: string;
  description: string;
  category: TaskCategory;
}
