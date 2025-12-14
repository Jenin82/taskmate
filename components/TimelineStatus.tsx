"use client";

import { Check, Circle, Clock } from "lucide-react";
import { TimelineEvent } from "@/types";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TimelineStatusProps {
  events: TimelineEvent[];
  className?: string;
}

export function TimelineStatus({ events, className }: TimelineStatusProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                  event.isCompleted &&
                    "border-green-500 bg-green-500 text-white",
                  event.isCurrent &&
                    "border-primary bg-primary/10 text-primary animate-pulse",
                  !event.isCompleted &&
                    !event.isCurrent &&
                    "border-muted bg-background text-muted-foreground"
                )}
              >
                {event.isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : event.isCurrent ? (
                  <Circle className="h-3 w-3 fill-current" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-8 transition-colors duration-300",
                    event.isCompleted ? "bg-green-500" : "bg-muted"
                  )}
                />
              )}
            </div>

            <div className={cn("pb-6", isLast && "pb-0")}>
              <p
                className={cn(
                  "font-medium leading-8 transition-colors duration-300",
                  event.isCompleted && "text-foreground",
                  event.isCurrent && "text-primary",
                  !event.isCompleted &&
                    !event.isCurrent &&
                    "text-muted-foreground"
                )}
              >
                {event.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {event.timestamp ? formatTime(event.timestamp) : "-"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
