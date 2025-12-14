"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Share2,
  AlertTriangle,
  X,
  Map,
} from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { LiveMap } from "@/components/LiveMap";
import { TaskerCard } from "@/components/TaskerCard";
import { TimelineStatus } from "@/components/TimelineStatus";
import { getCategoryEmoji, getCategoryLabel } from "@/lib/taskDetection";
import { formatPrice } from "@/lib/pricingCalculator";
import { TaskStatus } from "@/types";

const STATUS_LABELS: Record<TaskStatus, string> = {
  DRAFT: "Draft",
  REQUESTED: "Finding TaskMaster",
  ASSIGNED: "TaskMaster Assigned",
  EN_ROUTE: "On the Way",
  ARRIVED: "Arrived",
  IN_PROGRESS: "Task In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function TrackingPage() {
  const router = useRouter();
  const params = useParams();
  const { currentTask, updateStatus, updateTaskerLocation, resetTask } =
    useTaskStore();

  const [eta, setEta] = useState(15);
  const [distance, setDistance] = useState(3.5);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (!currentTask) return;

    if (currentTask.id !== params.id) {
      router.push("/");
      return;
    }

    if (
      currentTask.status === "CANCELLED" ||
      currentTask.status === "COMPLETED"
    ) {
      return;
    }

    const nextByStatus: Partial<
      Record<TaskStatus, { next: TaskStatus; delayMs: number }>
    > = {
      REQUESTED: { next: "ASSIGNED", delayMs: 1000 },
      ASSIGNED: { next: "EN_ROUTE", delayMs: 6000 },
      EN_ROUTE: { next: "ARRIVED", delayMs: 8000 },
      ARRIVED: { next: "IN_PROGRESS", delayMs: 8000 },
      IN_PROGRESS: { next: "COMPLETED", delayMs: 12000 },
    };

    const step = nextByStatus[currentTask.status];
    if (!step) return;

    const timeout = setTimeout(() => {
      updateStatus(step.next);
    }, step.delayMs);

    return () => clearTimeout(timeout);
  }, [currentTask?.id, currentTask?.status, params.id, router, updateStatus]);

  // Simulate ETA countdown
  useEffect(() => {
    if (
      !currentTask ||
      currentTask.status === "COMPLETED" ||
      currentTask.status === "CANCELLED"
    )
      return;

    const interval = setInterval(() => {
      setEta((prev) => Math.max(0, prev - 1));
      setDistance((prev) => Math.max(0, Math.round((prev - 0.1) * 10) / 10));
    }, 3000);

    return () => clearInterval(interval);
  }, [currentTask?.status, currentTask]);

  // Simulate tasker location updates
  useEffect(() => {
    if (!currentTask?.tasker || currentTask.status === "COMPLETED") return;

    const interval = setInterval(() => {
      const currentLoc = currentTask.tasker!.currentLocation;
      const targetLoc = currentTask.locations[0];

      if (!targetLoc) return;

      const newLat = currentLoc.lat + (targetLoc.lat - currentLoc.lat) * 0.1;
      const newLng = currentLoc.lng + (targetLoc.lng - currentLoc.lng) * 0.1;

      updateTaskerLocation({ lat: newLat, lng: newLng });
    }, 3000);

    return () => clearInterval(interval);
  }, [
    currentTask?.tasker?.id,
    currentTask?.locations?.[0]?.id,
    currentTask?.status,
    updateTaskerLocation,
  ]);

  const handleCancel = () => {
    updateStatus("CANCELLED");
    setShowCancelDialog(false);
    setTimeout(() => {
      resetTask();
      router.push("/");
    }, 2000);
  };

  const handleCall = () => {
    if (currentTask?.tasker?.phone) {
      window.open(`tel:${currentTask.tasker.phone}`, "_self");
    }
  };

  const handleMessage = () => {
    if (currentTask?.tasker?.phone) {
      window.open(`sms:${currentTask.tasker.phone}`, "_self");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Track my TaskMaster",
          text: `Track my ${getCategoryLabel(currentTask!.category)} task`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    }
  };

  if (!currentTask || !currentTask.tasker) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <p className="text-muted-foreground">Loading task details...</p>
        </div>
      </div>
    );
  }

  const isCompleted = currentTask.status === "COMPLETED";
  const isCancelled = currentTask.status === "CANCELLED";

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {getCategoryEmoji(currentTask.category)}
              </span>
              <div>
                <h1 className="font-semibold">
                  {getCategoryLabel(currentTask.category)}
                </h1>
                <Badge
                  variant={
                    isCompleted
                      ? "default"
                      : isCancelled
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {STATUS_LABELS[currentTask.status]}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="container mx-auto max-w-4xl space-y-4 px-4 py-6">
          {(isCompleted || isCancelled) && (
            <Card className={isCancelled ? "border-destructive/40" : undefined}>
              <CardHeader>
                <CardTitle>
                  {isCompleted ? "Task Completed" : "Task Cancelled"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {isCompleted
                    ? "Your task has been successfully completed."
                    : "Your request was cancelled."}
                </p>
                {currentTask.pricing && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-lg font-semibold">
                      {formatPrice(currentTask.pricing.total)}
                    </span>
                  </div>
                )}
                <Button
                  onClick={() => {
                    resetTask();
                    router.push("/");
                  }}
                  className="w-full"
                >
                  Book Another Task
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">TaskMaster</h2>
                <Badge variant="secondary">
                  {STATUS_LABELS[currentTask.status]}
                </Badge>
              </div>

              <TaskerCard
                tasker={currentTask.tasker}
                eta={isCompleted ? undefined : eta}
                distance={isCompleted ? undefined : distance}
                status={STATUS_LABELS[currentTask.status]}
                onCall={handleCall}
                onMessage={handleMessage}
              />

              <div className="grid grid-cols-2 gap-2">
                <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Map className="h-4 w-4" />
                      View Map
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl p-0 overflow-hidden">
                    <DialogHeader className="p-4 pb-0">
                      <DialogTitle>Live Map</DialogTitle>
                      <DialogDescription>
                        Track the TaskMaster and task locations in real time.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="h-[65vh] w-full">
                      <LiveMap
                        locations={currentTask.locations}
                        taskerLocation={currentTask.tasker.currentLocation}
                        animate={!isCompleted && !isCancelled}
                        className="h-full w-full"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>

                <Dialog
                  open={showCancelDialog}
                  onOpenChange={setShowCancelDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      disabled={isCompleted || isCancelled}
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Task?</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel this task?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelDialog(false)}
                      >
                        Keep Task
                      </Button>
                      <Button variant="destructive" onClick={handleCancel}>
                        Yes, Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={isCompleted || isCancelled}
                >
                  <AlertTriangle className="h-4 w-4" />
                  Report
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Progress Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineStatus events={currentTask.timeline} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
