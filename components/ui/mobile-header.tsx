import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
  step?: number;
  totalSteps?: number;
}

export function MobileHeader({
  title,
  showBackButton = true,
  backUrl,
  step,
  totalSteps,
}: MobileHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-background pt-2 pb-4 mb-4">
      <div className="flex items-center justify-between">
        {showBackButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-9 w-9 rounded-full"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-9" />
        )}
        <h1 className="text-lg font-semibold text-center flex-1 truncate px-2">
          {title}
        </h1>
        <div className="w-9" />
      </div>

      {step && totalSteps && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
