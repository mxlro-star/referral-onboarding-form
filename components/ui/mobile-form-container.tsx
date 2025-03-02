import React from "react";
import { MobileHeader } from "./mobile-header";

interface MobileFormContainerProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
  step?: number;
  totalSteps?: number;
}

export function MobileFormContainer({
  children,
  title,
  showBackButton = true,
  backUrl,
  step,
  totalSteps,
}: MobileFormContainerProps) {
  return (
    <div className="flex flex-col flex-1">
      <MobileHeader
        title={title}
        showBackButton={showBackButton}
        backUrl={backUrl}
        step={step}
        totalSteps={totalSteps}
      />
      <div className="flex-1 pb-6">{children}</div>
    </div>
  );
}
