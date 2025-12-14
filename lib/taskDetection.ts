import { TaskCategory } from "@/types";

interface KeywordMapping {
  keywords: string[];
  category: TaskCategory;
}

const KEYWORD_MAPPINGS: KeywordMapping[] = [
  {
    keywords: [
      "fuel",
      "petrol",
      "gas",
      "diesel",
      "gasoline",
      "fill up",
      "refuel",
    ],
    category: "FUEL_DELIVERY",
  },
  {
    keywords: [
      "queue",
      "wait",
      "line",
      "standing",
      "waiting",
      "stand in line",
      "wait in queue",
    ],
    category: "QUEUE_STANDING",
  },
  {
    keywords: [
      "pickup",
      "pick up",
      "deliver",
      "drop",
      "courier",
      "package",
      "parcel",
      "collect",
      "send",
    ],
    category: "PICKUP_DELIVERY",
  },
];

export function detectTaskCategory(description: string): TaskCategory {
  const lowerDescription = description.toLowerCase();

  for (const mapping of KEYWORD_MAPPINGS) {
    for (const keyword of mapping.keywords) {
      if (lowerDescription.includes(keyword)) {
        return mapping.category;
      }
    }
  }

  return "GENERAL_TASK";
}

export function getCategoryLabel(category: TaskCategory): string {
  const labels: Record<TaskCategory, string> = {
    FUEL_DELIVERY: "Fuel Delivery",
    QUEUE_STANDING: "Queue Standing",
    PICKUP_DELIVERY: "Pickup & Delivery",
    GENERAL_TASK: "General Task",
  };
  return labels[category];
}

export function getCategoryEmoji(category: TaskCategory): string {
  const emojis: Record<TaskCategory, string> = {
    FUEL_DELIVERY: "🛢️",
    QUEUE_STANDING: "⏱️",
    PICKUP_DELIVERY: "📦",
    GENERAL_TASK: "🏃",
  };
  return emojis[category];
}

export function getCategoryDescription(category: TaskCategory): string {
  const descriptions: Record<TaskCategory, string> = {
    FUEL_DELIVERY: "We'll deliver fuel right to your location",
    QUEUE_STANDING: "Someone will wait in line on your behalf",
    PICKUP_DELIVERY: "Pick up and deliver items for you",
    GENERAL_TASK: "We'll help you with any task you need",
  };
  return descriptions[category];
}
