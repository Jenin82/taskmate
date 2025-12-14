"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Plus, Trash2, MapPin } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { LocationPicker } from "@/components/LocationPicker";
import { ProgressStepper } from "@/components/ProgressStepper";
import {
  getCategoryEmoji,
  getCategoryLabel,
  getCategoryDescription,
} from "@/lib/taskDetection";
import {
  Location,
  FuelDeliveryDetails,
  QueueStandingDetails,
  PickupDeliveryDetails,
  GeneralTaskDetails,
} from "@/types";
import { generateId } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Task" },
  { id: 2, label: "Details" },
  { id: 3, label: "Payment" },
  { id: 4, label: "Track" },
];

export default function TaskDetailsPage() {
  const router = useRouter();
  const { currentTask, updateLocations, updateDetails } = useTaskStore();

  const [locations, setLocations] = useState<(Location | null)[]>([null]);
  const [locationType, setLocationType] = useState<
    "single" | "two" | "multiple"
  >("single");

  // Fuel Delivery state
  const [fuelType, setFuelType] = useState<"petrol" | "diesel">("petrol");
  const [fuelQuantity, setFuelQuantity] = useState(10);
  const [timePreference, setTimePreference] = useState<"asap" | "scheduled">(
    "asap"
  );

  // Queue Standing state
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [taskDescription, setTaskDescription] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  // Pickup Delivery state
  const [packageSize, setPackageSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [specialInstructions, setSpecialInstructions] = useState("");

  // General Task state
  const [estimatedDuration, setEstimatedDuration] = useState(2);
  const [detailedDescription, setDetailedDescription] = useState("");

  useEffect(() => {
    if (!currentTask) {
      router.push("/");
    }
  }, [currentTask, router]);

  useEffect(() => {
    if (locationType === "single") {
      setLocations([locations[0] || null]);
    } else if (locationType === "two") {
      setLocations([locations[0] || null, locations[1] || null]);
    }
  }, [locationType]);

  const handleLocationChange = (index: number, location: Location | null) => {
    const newLocations = [...locations];
    newLocations[index] = location;
    setLocations(newLocations);
  };

  const addLocation = () => {
    if (locations.length < 5) {
      setLocations([...locations, null]);
    }
  };

  const removeLocation = (index: number) => {
    if (locations.length > 1) {
      setLocations(locations.filter((_, i) => i !== index));
    }
  };

  const isValid = () => {
    const hasLocations = locations.some((loc) => loc !== null);
    if (!hasLocations) return false;

    if (currentTask?.category === "QUEUE_STANDING" && !taskDescription.trim())
      return false;
    if (currentTask?.category === "GENERAL_TASK" && !detailedDescription.trim())
      return false;

    return true;
  };

  const handleContinue = () => {
    if (!isValid() || !currentTask) return;

    const validLocations = locations.filter(
      (loc): loc is Location => loc !== null
    );

    // Update location types based on category and position
    const updatedLocations: Location[] = validLocations.map((loc, index) => {
      if (
        currentTask.category === "PICKUP_DELIVERY" &&
        locationType === "two"
      ) {
        const locType: "pickup" | "dropoff" | "general" =
          index === 0 ? "pickup" : "dropoff";
        return { ...loc, type: locType };
      }
      return loc;
    });

    updateLocations(updatedLocations);

    let details:
      | FuelDeliveryDetails
      | QueueStandingDetails
      | PickupDeliveryDetails
      | GeneralTaskDetails;

    switch (currentTask.category) {
      case "FUEL_DELIVERY":
        details = { fuelType, quantity: fuelQuantity, timePreference };
        break;
      case "QUEUE_STANDING":
        details = { estimatedHours, taskDescription, additionalInstructions };
        break;
      case "PICKUP_DELIVERY":
        details = { locationType, packageSize, specialInstructions };
        break;
      case "GENERAL_TASK":
      default:
        details = {
          estimatedDuration,
          detailedDescription,
          needsMultipleLocations: locations.length > 1,
        };
        break;
    }

    updateDetails(details);
    router.push("/payment");
  };

  if (!currentTask) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-8">
      <div className="container mx-auto px-4 py-6">
        <div className="mx-auto max-w-2xl">
          {/* Progress Stepper */}
          <ProgressStepper steps={STEPS} currentStep={2} className="mb-8" />

          {/* Task Summary */}
          <Card className="mb-6">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                {getCategoryEmoji(currentTask.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">
                    {getCategoryLabel(currentTask.category)}
                  </h2>
                  <Badge variant="secondary">Step 2 of 4</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {currentTask.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Form */}
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                {getCategoryDescription(currentTask.category)}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* FUEL DELIVERY FORM */}
              {currentTask.category === "FUEL_DELIVERY" && (
                <>
                  <div className="space-y-2">
                    <Label>Delivery Location</Label>
                    <LocationPicker
                      value={locations[0] || undefined}
                      onChange={(loc) => handleLocationChange(0, loc)}
                      placeholder="Enter delivery address..."
                      locationType="dropoff"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Fuel Type</Label>
                      <Select
                        value={fuelType}
                        onValueChange={(v) =>
                          setFuelType(v as "petrol" | "diesel")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="petrol">⛽ Petrol</SelectItem>
                          <SelectItem value="diesel">🛢️ Diesel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity (Liters): {fuelQuantity}L</Label>
                      <Slider
                        value={[fuelQuantity]}
                        onValueChange={([v]) => setFuelQuantity(v)}
                        min={5}
                        max={50}
                        step={5}
                        className="mt-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Preference</Label>
                    <RadioGroup
                      value={timePreference}
                      onValueChange={(v) =>
                        setTimePreference(v as "asap" | "scheduled")
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="asap" id="asap" />
                        <Label
                          htmlFor="asap"
                          className="font-normal cursor-pointer"
                        >
                          ASAP - As soon as possible
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="scheduled" id="scheduled" />
                        <Label
                          htmlFor="scheduled"
                          className="font-normal cursor-pointer"
                        >
                          Schedule for later
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}

              {/* QUEUE STANDING FORM */}
              {currentTask.category === "QUEUE_STANDING" && (
                <>
                  <div className="space-y-2">
                    <Label>Queue Location</Label>
                    <LocationPicker
                      value={locations[0] || undefined}
                      onChange={(loc) => handleLocationChange(0, loc)}
                      placeholder="Enter queue location..."
                      locationType="general"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Estimated Hours Needed: {estimatedHours} hour
                      {estimatedHours > 1 ? "s" : ""}
                    </Label>
                    <Slider
                      value={[estimatedHours]}
                      onValueChange={([v]) => setEstimatedHours(v)}
                      min={1}
                      max={8}
                      step={0.5}
                      className="mt-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>What do you need done?</Label>
                    <Textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="e.g., Wait in line at RTO for vehicle registration..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Instructions (Optional)</Label>
                    <Textarea
                      value={additionalInstructions}
                      onChange={(e) =>
                        setAdditionalInstructions(e.target.value)
                      }
                      placeholder="Any specific instructions for the TaskMaster..."
                      rows={2}
                    />
                  </div>
                </>
              )}

              {/* PICKUP DELIVERY FORM */}
              {currentTask.category === "PICKUP_DELIVERY" && (
                <>
                  <div className="space-y-2">
                    <Label>Location Type</Label>
                    <RadioGroup
                      value={locationType}
                      onValueChange={(v) =>
                        setLocationType(v as "single" | "two" | "multiple")
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="single" id="single" />
                        <Label
                          htmlFor="single"
                          className="font-normal cursor-pointer"
                        >
                          Single Location (Delivery only)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="two" id="two" />
                        <Label
                          htmlFor="two"
                          className="font-normal cursor-pointer"
                        >
                          Two Locations (Pickup → Dropoff)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="multiple" id="multiple" />
                        <Label
                          htmlFor="multiple"
                          className="font-normal cursor-pointer"
                        >
                          Multiple Stops (Up to 5)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    {locations.map((location, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                              {index + 1}
                            </span>
                            {locationType === "two"
                              ? index === 0
                                ? "Pickup Location"
                                : "Dropoff Location"
                              : `Location ${index + 1}`}
                          </Label>
                          {locationType === "multiple" &&
                            locations.length > 1 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeLocation(index)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                        </div>
                        <LocationPicker
                          value={location || undefined}
                          onChange={(loc) => handleLocationChange(index, loc)}
                          placeholder={`Enter ${
                            locationType === "two"
                              ? index === 0
                                ? "pickup"
                                : "dropoff"
                              : ""
                          } address...`}
                          locationType={index === 0 ? "pickup" : "dropoff"}
                          showMap={index === 0}
                        />
                      </div>
                    ))}

                    {locationType === "multiple" && locations.length < 5 && (
                      <Button
                        variant="outline"
                        onClick={addLocation}
                        className="w-full gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Another Location
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Package Size</Label>
                    <Select
                      value={packageSize}
                      onValueChange={(v) =>
                        setPackageSize(v as "small" | "medium" | "large")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">
                          📦 Small (fits in backpack)
                        </SelectItem>
                        <SelectItem value="medium">
                          📦 Medium (fits on bike)
                        </SelectItem>
                        <SelectItem value="large">
                          📦 Large (needs car)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Special Instructions (Optional)</Label>
                    <Textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Any special handling instructions..."
                      rows={2}
                    />
                  </div>
                </>
              )}

              {/* GENERAL TASK FORM */}
              {currentTask.category === "GENERAL_TASK" && (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Location(s)</Label>
                      {locations.length < 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={addLocation}
                          className="gap-1 h-8"
                        >
                          <Plus className="h-3 w-3" />
                          Add Location
                        </Button>
                      )}
                    </div>
                    {locations.map((location, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            Location {index + 1}
                          </span>
                          {locations.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeLocation(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <LocationPicker
                          value={location || undefined}
                          onChange={(loc) => handleLocationChange(index, loc)}
                          placeholder="Enter location..."
                          locationType="general"
                          showMap={index === 0}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Estimated Duration: {estimatedDuration} hour
                      {estimatedDuration > 1 ? "s" : ""}
                    </Label>
                    <Slider
                      value={[estimatedDuration]}
                      onValueChange={([v]) => setEstimatedDuration(v)}
                      min={1}
                      max={8}
                      step={0.5}
                      className="mt-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Detailed Description</Label>
                    <Textarea
                      value={detailedDescription}
                      onChange={(e) => setDetailedDescription(e.target.value)}
                      placeholder="Describe what you need done in detail..."
                      rows={4}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!isValid()}
              className="gap-2"
            >
              Continue to Payment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
