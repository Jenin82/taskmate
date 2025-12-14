"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import {
  detectTaskCategory,
  getCategoryLabel,
  getCategoryEmoji,
} from "@/lib/taskDetection";
import { TASK_TEMPLATES } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const { createTask } = useTaskStore();
  const [description, setDescription] = useState("");
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isValid = description.trim().length >= 10;

  useEffect(() => {
    if (description.trim().length > 3) {
      const category = detectTaskCategory(description);
      setDetectedCategory(category);
    } else {
      setDetectedCategory(null);
    }
  }, [description]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [description]);

  const handleSubmit = () => {
    if (!isValid) return;
    const category = detectTaskCategory(description);
    createTask(description, category);
    router.push("/task-details");
  };

  const handleTemplateClick = (template: (typeof TASK_TEMPLATES)[0]) => {
    setDescription(template.description);
    setDetectedCategory(template.category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                TaskMaster
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
              What do you need help with?
            </h1>
            <p className="text-muted-foreground">
              Describe your task and we&apos;ll connect you with a TaskMaster
              nearby
            </p>
          </div>

          {/* Main Input Card */}
          <Card className="mb-6 overflow-hidden border-2 shadow-lg transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-xl">
            <CardContent className="p-0">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., 'Deliver 20L petrol to my location' or 'Wait in queue at DMV for 2 hours'"
                  className="min-h-[120px] resize-none border-0 p-4 text-base focus-visible:ring-0 md:min-h-[140px] md:p-6 md:text-lg"
                />

                {/* Detected category badge */}
                {detectedCategory && (
                  <div className="absolute bottom-3 left-4 md:bottom-4 md:left-6">
                    <Badge
                      variant="secondary"
                      className="animate-in fade-in slide-in-from-bottom-2 gap-1.5"
                    >
                      <Sparkles className="h-3 w-3" />
                      {getCategoryEmoji(detectedCategory as any)}{" "}
                      {getCategoryLabel(detectedCategory as any)}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3 md:px-6">
                <span
                  className={cn(
                    "text-xs transition-colors",
                    isValid ? "text-green-600" : "text-muted-foreground"
                  )}
                >
                  {description.length} / 10+ characters
                </span>
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid}
                  className="gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Task Templates */}
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Or choose a common task type
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {TASK_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "cursor-pointer border-2 transition-all duration-200 hover:border-primary/50 hover:shadow-md",
                    detectedCategory === template.category &&
                      "border-primary bg-primary/5"
                  )}
                  onClick={() => handleTemplateClick(template)}
                >
                  <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                    <span className="text-2xl">{template.emoji}</span>
                    <span className="text-sm font-medium">
                      {template.title}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs font-medium">Quick Matching</p>
              <p className="text-xs text-muted-foreground">Under 5 mins</p>
            </div>
            <div className="space-y-1">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p className="text-xs font-medium">Live Tracking</p>
              <p className="text-xs text-muted-foreground">Real-time updates</p>
            </div>
            <div className="space-y-1">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-5 w-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <p className="text-xs font-medium">Fair Pricing</p>
              <p className="text-xs text-muted-foreground">Transparent rates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
