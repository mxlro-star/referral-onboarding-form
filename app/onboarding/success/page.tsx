"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOnboardingState } from "@/features/onboarding/store";
import { useEffect } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const reset = useOnboardingState((state) => state.reset);

  // Redirect if accessed directly without completing the form
  useEffect(() => {
    const storedDataStr =
      typeof window !== "undefined"
        ? localStorage.getItem("onboarding-storage")
        : null;

    if (storedDataStr) {
      try {
        const parsedData = JSON.parse(storedDataStr);
        const state = parsedData.state || {};

        // Check if form was completed
        if (!state.termsAndConditions) {
          router.push("/onboarding/personal-info");
        }
      } catch (e) {
        router.push("/onboarding/personal-info");
      }
    } else {
      router.push("/onboarding/personal-info");
    }
  }, [router]);

  const handleStartNew = () => {
    reset();
    router.push("/onboarding/personal-info");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold">Submission Successful!</h1>

        <p className="text-muted-foreground">
          Thank you for completing your onboarding information. Your details
          have been successfully submitted.
        </p>

        <div className="bg-muted p-4 rounded-lg text-sm text-left">
          <h2 className="font-medium mb-2">What happens next?</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Our team will review your information</li>
            <li>You'll receive a confirmation email shortly</li>
            <li>We'll contact you if we need any additional information</li>
          </ul>
        </div>

        <div className="pt-4">
          <Button onClick={handleStartNew} className="w-full">
            Start a New Application
          </Button>
        </div>
      </div>
    </div>
  );
}
