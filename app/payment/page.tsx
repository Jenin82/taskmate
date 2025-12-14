"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Banknote,
  Tag,
  MapPin,
  Clock,
  Package,
} from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { PriceBreakdown } from "@/components/PriceBreakdown";
import { SearchingOverlay } from "@/components/SearchingOverlay";
import { getCategoryEmoji, getCategoryLabel } from "@/lib/taskDetection";
import { calculatePricing, formatPrice } from "@/lib/pricingCalculator";
import { getRandomTasker } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "upi" | "cash";

export default function PaymentPage() {
  const router = useRouter();
  const { currentTask, updatePricing, assignTasker, updateStatus } =
    useTaskStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!currentTask || !currentTask.details) {
      router.push("/");
      return;
    }

    // Calculate pricing
    const pricing = calculatePricing(
      currentTask.category,
      currentTask.locations,
      currentTask.details
    );

    const existing = currentTask.pricing;
    const isSamePricing =
      !!existing &&
      existing.baseFare === pricing.baseFare &&
      existing.distanceCost === pricing.distanceCost &&
      existing.timeCost === pricing.timeCost &&
      existing.serviceFee === pricing.serviceFee &&
      existing.total === pricing.total &&
      existing.distance === pricing.distance &&
      existing.duration === pricing.duration;

    if (!isSamePricing) {
      updatePricing(pricing);
    }
  }, [
    router,
    updatePricing,
    currentTask?.id,
    currentTask?.category,
    currentTask?.details,
    currentTask?.locations,
  ]);

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "first50") {
      setCouponApplied(true);
    }
  };

  const handleConfirm = () => {
    if (!termsAccepted || !currentTask) return;

    setIsSearching(true);
  };

  const handleSearchComplete = () => {
    if (!currentTask) return;

    // Assign a random tasker
    const tasker = getRandomTasker();
    assignTasker(tasker);
    updateStatus("REQUESTED");

    setIsSearching(false);
    router.push(`/tracking/${currentTask.id}`);
  };

  if (!currentTask || !currentTask.pricing) {
    return null;
  }

  const discountedPricing = couponApplied
    ? {
        ...currentTask.pricing,
        total: Math.round(currentTask.pricing.total * 0.5),
      }
    : currentTask.pricing;

  return (
    <>
      <SearchingOverlay
        isSearching={isSearching}
        onComplete={handleSearchComplete}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="mx-auto max-w-2xl">
            {/* Progress Stepper */}

            {/* Task Summary */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Task Summary</CardTitle>
                  <Badge variant="secondary">
                    {getCategoryEmoji(currentTask.category)}{" "}
                    {getCategoryLabel(currentTask.category)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {currentTask.description}
                </p>

                {/* Locations */}
                <div className="space-y-2">
                  {currentTask.locations.map((location, index) => (
                    <div key={location.id} className="flex items-start gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {index + 1}
                      </div>
                      <div className="flex items-start gap-1.5">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-sm">{location.address}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Duration/Distance */}
                <div className="flex items-center gap-4 border-t pt-3">
                  {currentTask.pricing.distance && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>{currentTask.pricing.distance} km</span>
                    </div>
                  )}
                  {currentTask.pricing.duration && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {currentTask.pricing.duration} hour
                        {currentTask.pricing.duration > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <PriceBreakdown
              pricing={discountedPricing}
              className="mb-6"
              animate
            />

            {/* Coupon Code */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Tag className="h-4 w-4" />
                      Coupon Code
                    </Label>
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      disabled={couponApplied}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={!couponCode || couponApplied}
                  >
                    {couponApplied ? "Applied!" : "Apply"}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="mt-2 text-sm text-green-600">
                    🎉 50% discount applied! You save{" "}
                    {formatPrice(
                      currentTask.pricing.total - discountedPricing.total
                    )}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Try &quot;FIRST50&quot; for 50% off your first task
                </p>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                      paymentMethod === "card" && "border-primary bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <Label
                      htmlFor="card"
                      className="flex flex-1 items-center gap-3 cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-xs text-muted-foreground">
                          Pay securely with your card
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors mt-2",
                      paymentMethod === "upi" && "border-primary bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value="upi" id="upi" />
                    <Label
                      htmlFor="upi"
                      className="flex flex-1 items-center gap-3 cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <Smartphone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-xs text-muted-foreground">
                          GPay, PhonePe, Paytm, etc.
                        </p>
                      </div>
                    </Label>
                  </div>

                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-colors mt-2",
                      paymentMethod === "cash" && "border-primary bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value="cash" id="cash" />
                    <Label
                      htmlFor="cash"
                      className="flex flex-1 items-center gap-3 cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                        <Banknote className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Cash on Service</p>
                        <p className="text-xs text-muted-foreground">
                          Pay when task is completed
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Terms */}
            <div className="mb-6 flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) =>
                  setTermsAccepted(checked as boolean)
                }
              />
              <Label
                htmlFor="terms"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                I agree to the{" "}
                <span className="text-primary underline">Terms of Service</span>{" "}
                and{" "}
                <span className="text-primary underline">Privacy Policy</span>.
                I understand that the final price may vary based on actual
                distance/time.
              </Label>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => router.push("/task-details")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!termsAccepted || isSearching}
                size="lg"
                className="gap-2"
              >
                Confirm & Request TaskMaster
                <span className="font-bold">
                  {formatPrice(discountedPricing.total)}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
