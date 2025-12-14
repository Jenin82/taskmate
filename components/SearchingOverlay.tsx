"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, User, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchingOverlayProps {
  isSearching: boolean;
  onComplete?: () => void;
}

const SEARCH_MESSAGES = [
  "Finding nearby TaskMasters...",
  "Checking availability...",
  "Matching your request...",
  "Almost there...",
  "TaskMaster found!",
];

export function SearchingOverlay({
  isSearching,
  onComplete,
}: SearchingOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      setMessageIndex(0);
      setIsComplete(false);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev >= SEARCH_MESSAGES.length - 2) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
              onComplete?.();
            }, 1000);
          }, 1000);
          return SEARCH_MESSAGES.length - 1;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isSearching, onComplete]);

  if (!isSearching) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 p-8">
        {/* Animated circles */}
        <div className="relative">
          <div
            className={cn(
              "absolute inset-0 rounded-full border-4 border-primary/20",
              !isComplete && "animate-ping"
            )}
            style={{ width: 120, height: 120 }}
          />
          <div
            className={cn(
              "absolute inset-0 rounded-full border-4 border-primary/30",
              !isComplete && "animate-pulse"
            )}
            style={{ width: 120, height: 120, animationDelay: "0.2s" }}
          />
          <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full bg-primary/10">
            {isComplete ? (
              <CheckCircle className="h-12 w-12 text-green-500 animate-in zoom-in duration-300" />
            ) : (
              <div className="relative">
                <User className="h-10 w-10 text-primary" />
                <MapPin className="absolute -bottom-1 -right-1 h-5 w-5 text-primary animate-bounce" />
              </div>
            )}
          </div>
        </div>

        {/* Search message */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-medium text-foreground animate-in fade-in duration-300">
            {SEARCH_MESSAGES[messageIndex]}
          </p>
          {!isComplete && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Please wait</span>
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {SEARCH_MESSAGES.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                index <= messageIndex
                  ? "bg-primary scale-100"
                  : "bg-muted scale-75"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
