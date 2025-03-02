"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the onboarding process
    const timer = setTimeout(() => {
      router.push("/onboarding/personal-info");
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return <Loading message="Preparing your onboarding form..." />;
}
