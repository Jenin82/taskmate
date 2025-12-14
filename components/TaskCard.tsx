"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Package, Fuel, Users } from "lucide-react";
import { Task, TaskCategory } from "@/types";
import { getCategoryEmoji, getCategoryLabel } from "@/lib/taskDetection";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  className?: string;
  compact?: boolean;
}

function getCategoryIcon(category: TaskCategory) {
  const icons = {
    FUEL_DELIVERY: Fuel,
    QUEUE_STANDING: Clock,
    PICKUP_DELIVERY: Package,
    GENERAL_TASK: Users,
  };
  return icons[category];
}

export function TaskCard({ task, className, compact = false }: TaskCardProps) {
  const Icon = getCategoryIcon(task.category);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn("pb-2", compact && "p-3")}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className={cn("text-base", compact && "text-sm")}>
                {getCategoryEmoji(task.category)}{" "}
                {getCategoryLabel(task.category)}
              </CardTitle>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {task.description}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {task.status.replace("_", " ")}
          </Badge>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="pt-0">
          {task.locations.length > 0 && (
            <div className="space-y-2">
              {task.locations.map((location, index) => (
                <div key={location.id} className="flex items-start gap-2">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground line-clamp-2">
                      {location.address}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {task.pricing && (
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="text-sm text-muted-foreground">
                {task.pricing.distance && `${task.pricing.distance} km`}
                {task.pricing.duration &&
                  `${task.pricing.duration} hr${
                    task.pricing.duration > 1 ? "s" : ""
                  }`}
              </span>
              <span className="text-lg font-semibold">
                ₹{task.pricing.total}
              </span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
