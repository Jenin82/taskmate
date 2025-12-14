"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pricing } from "@/types";
import { formatPrice } from "@/lib/pricingCalculator";
import { cn } from "@/lib/utils";

interface PriceBreakdownProps {
  pricing: Pricing;
  className?: string;
  animate?: boolean;
}

function AnimatedNumber({
  value,
  prefix = "",
}: {
  value: number;
  prefix?: string;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 500;
    const steps = 20;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString("en-IN")}
    </span>
  );
}

export function PriceBreakdown({
  pricing,
  className,
  animate = true,
}: PriceBreakdownProps) {
  const items = [
    pricing.baseFare > 0 && { label: "Base Fare", value: pricing.baseFare },
    pricing.distanceCost && {
      label: `Distance (${pricing.distance} km)`,
      value: pricing.distanceCost,
    },
    pricing.timeCost && {
      label: `Time (${pricing.duration} hr${
        (pricing.duration || 1) > 1 ? "s" : ""
      })`,
      value: pricing.timeCost,
    },
    { label: "Service Fee", value: pricing.serviceFee },
  ].filter(Boolean) as { label: string; value: number }[];

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">
              {animate ? (
                <AnimatedNumber value={item.value} prefix="₹" />
              ) : (
                formatPrice(item.value)
              )}
            </span>
          </div>
        ))}

        <Separator />

        <div className="flex items-center justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold text-primary">
            {animate ? (
              <AnimatedNumber value={pricing.total} prefix="₹" />
            ) : (
              formatPrice(pricing.total)
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
