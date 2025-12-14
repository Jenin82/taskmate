import { Tasker, TaskTemplate, Location } from "@/types";

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: "1",
    emoji: "🛢️",
    title: "Fuel Delivery",
    description: "Get petrol or diesel delivered to your location",
    category: "FUEL_DELIVERY",
  },
  {
    id: "2",
    emoji: "⏱️",
    title: "Queue Standing",
    description: "Have someone wait in line for you",
    category: "QUEUE_STANDING",
  },
  {
    id: "3",
    emoji: "📦",
    title: "Pickup & Delivery",
    description: "Pick up items and deliver them anywhere",
    category: "PICKUP_DELIVERY",
  },
  {
    id: "4",
    emoji: "🏃",
    title: "Running Errands",
    description: "Get help with any task you need done",
    category: "GENERAL_TASK",
  },
];

export const SAMPLE_TASKERS: Tasker[] = [
  {
    id: "t1",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    rating: 4.8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    currentLocation: { lat: 12.9716, lng: 77.5946 },
    vehicleType: "🏍️ Two Wheeler",
  },
  {
    id: "t2",
    name: "Priya Sharma",
    phone: "+91 98765 43211",
    rating: 4.9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    currentLocation: { lat: 12.9616, lng: 77.5846 },
    vehicleType: "🚗 Four Wheeler",
  },
  {
    id: "t3",
    name: "Amit Patel",
    phone: "+91 98765 43212",
    rating: 4.7,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
    currentLocation: { lat: 12.9816, lng: 77.6046 },
    vehicleType: "🏍️ Two Wheeler",
  },
  {
    id: "t4",
    name: "Sunita Reddy",
    phone: "+91 98765 43213",
    rating: 4.6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita",
    currentLocation: { lat: 12.9516, lng: 77.5746 },
    vehicleType: "🚗 Four Wheeler",
  },
  {
    id: "t5",
    name: "Vikram Singh",
    phone: "+91 98765 43214",
    rating: 4.9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    currentLocation: { lat: 12.9916, lng: 77.6146 },
    vehicleType: "🏍️ Two Wheeler",
  },
  {
    id: "t6",
    name: "Meera Nair",
    phone: "+91 98765 43215",
    rating: 4.8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
    currentLocation: { lat: 12.9416, lng: 77.5646 },
    vehicleType: "🚗 Four Wheeler",
  },
  {
    id: "t7",
    name: "Arjun Das",
    phone: "+91 98765 43216",
    rating: 4.5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    currentLocation: { lat: 12.9316, lng: 77.5546 },
    vehicleType: "🏍️ Two Wheeler",
  },
  {
    id: "t8",
    name: "Kavitha Menon",
    phone: "+91 98765 43217",
    rating: 4.7,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavitha",
    currentLocation: { lat: 13.0016, lng: 77.6246 },
    vehicleType: "🚗 Four Wheeler",
  },
  {
    id: "t9",
    name: "Rahul Joshi",
    phone: "+91 98765 43218",
    rating: 4.8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    currentLocation: { lat: 12.9216, lng: 77.5446 },
    vehicleType: "🏍️ Two Wheeler",
  },
  {
    id: "t10",
    name: "Deepa Iyer",
    phone: "+91 98765 43219",
    rating: 4.9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Deepa",
    currentLocation: { lat: 13.0116, lng: 77.6346 },
    vehicleType: "🚗 Four Wheeler",
  },
];

export const SAMPLE_LOCATIONS: Location[] = [
  {
    id: "loc1",
    address: "MG Road, Bengaluru, Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    type: "general",
  },
  {
    id: "loc2",
    address: "Indiranagar, Bengaluru, Karnataka",
    lat: 12.9784,
    lng: 77.6408,
    type: "general",
  },
  {
    id: "loc3",
    address: "Koramangala, Bengaluru, Karnataka",
    lat: 12.9279,
    lng: 77.6271,
    type: "general",
  },
  {
    id: "loc4",
    address: "HSR Layout, Bengaluru, Karnataka",
    lat: 12.9116,
    lng: 77.6389,
    type: "general",
  },
  {
    id: "loc5",
    address: "Whitefield, Bengaluru, Karnataka",
    lat: 12.9698,
    lng: 77.75,
    type: "general",
  },
];

export const PRICING_CONSTANTS = {
  FUEL_DELIVERY: {
    baseFare: 50,
    perKm: 15,
    serviceFee: 20,
  },
  PICKUP_DELIVERY: {
    baseFare: 50,
    perKm: 15,
    serviceFee: 20,
  },
  QUEUE_STANDING: {
    perHour: 200,
    minimumHours: 1,
    serviceFee: 30,
  },
  GENERAL_TASK: {
    perHour: 200,
    minimumHours: 1,
    serviceFee: 30,
  },
};

export function getRandomTasker(): Tasker {
  const randomIndex = Math.floor(Math.random() * SAMPLE_TASKERS.length);
  return SAMPLE_TASKERS[randomIndex];
}

export function getRandomETA(): number {
  return Math.floor(Math.random() * 15) + 5; // 5-20 minutes
}

export function getRandomDistance(): number {
  return Math.round((Math.random() * 8 + 1) * 10) / 10; // 1-9 km with 1 decimal
}
