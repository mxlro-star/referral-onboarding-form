"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";
import { useOnboardingState } from "@/features/onboarding/store";

export default function Home() {
  const router = useRouter();
  const reset = useOnboardingState((state) => state.reset);

  useEffect(() => {
    // Reset the store when the root page loads
    reset();

    // Redirect to the onboarding process
    const timer = setTimeout(() => {
      router.push("/onboarding/personal-info");
    }, 500);

    return () => clearTimeout(timer);
  }, [router, reset]);

  return <Loading message="Preparing your onboarding form..." />;
}
