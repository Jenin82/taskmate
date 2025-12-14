"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, MessageCircle, Navigation } from "lucide-react";
import { Tasker } from "@/types";
import { cn } from "@/lib/utils";

interface TaskerCardProps {
  tasker: Tasker;
  eta?: number;
  distance?: number;
  status?: string;
  className?: string;
  onCall?: () => void;
  onMessage?: () => void;
}

export function TaskerCard({
  tasker,
  eta,
  distance,
  status = "On the way",
  className,
  onCall,
  onMessage,
}: TaskerCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 border-2 border-background shadow-md">
            <AvatarImage src={tasker.avatar} alt={tasker.name} />
            <AvatarFallback>{tasker.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold truncate">{tasker.name}</h3>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{tasker.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {tasker.vehicleType}
              </Badge>
              <span className="text-xs text-muted-foreground">{status}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onCall}
          >
            <Phone className="mr-1.5 h-4 w-4" />
            Call
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onMessage}
          >
            <MessageCircle className="mr-1.5 h-4 w-4" />
            Message
          </Button>
        </div>

        {(eta !== undefined || distance !== undefined) && (
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t">
            {eta !== undefined && (
              <div className="flex items-center gap-1.5 text-sm">
                <Navigation className="h-4 w-4 text-primary" />
                <span className="font-medium">ETA: {eta} mins</span>
              </div>
            )}
            {distance !== undefined && (
              <div className="text-sm text-muted-foreground">
                {distance} km away
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
