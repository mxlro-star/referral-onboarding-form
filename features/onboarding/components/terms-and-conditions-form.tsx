"use client";

import { onboardingSchema } from "../schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { useOnboardingState } from "@/features/onboarding/store";
import { Loading } from "@/components/ui/loading";
import { MobileFormContainer } from "@/components/ui/mobile-form-container";

const onboardingTermsAndConditionsSchema = onboardingSchema.pick({
  termsAndConditions: true,
});

type OnboardingTermsAndConditionsSchema = z.infer<
  typeof onboardingTermsAndConditionsSchema
>;

export const TermsAndConditionsForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  const setData = useOnboardingState((state) => state.setData);
  const termsAndConditions = useOnboardingState(
    (state) => state.termsAndConditions
  );
  const onboardingData = useOnboardingState();

  const form = useForm<OnboardingTermsAndConditionsSchema>({
    resolver: zodResolver(onboardingTermsAndConditionsSchema),
    defaultValues: {
      termsAndConditions: termsAndConditions || false,
    },
  });

  // Update form when persisted data changes
  useEffect(() => {
    if (!useOnboardingState.persist?.hasHydrated) return;

    // Add a small delay to ensure loading screen is visible during navigation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    if (termsAndConditions !== undefined) {
      form.setValue("termsAndConditions", termsAndConditions);
    }

    // Create a separate effect for the redirect logic to avoid race conditions
    const checkRequiredFields = () => {
      // Check if we're in a browser environment and if localStorage has our data
      const storedDataStr =
        typeof window !== "undefined"
          ? localStorage.getItem("onboarding-storage")
          : null;

      if (storedDataStr) {
        try {
          const parsedData = JSON.parse(storedDataStr);
          const state = parsedData.state || {};

          // Only redirect if truly missing required fields
          const missingRequiredFields =
            !state.firstName ||
            !state.surname ||
            !state.title ||
            !state.email ||
            !state.phone ||
            !state.birthDate ||
            !state.gender ||
            !state.nino ||
            !state.birthPlace ||
            !state.addressLine1 ||
            !state.postTown ||
            !state.postcode ||
            !state.country ||
            !state.maritalStatus ||
            !state.enteredUK ||
            !state.nationality ||
            !state.immigrationStatus ||
            !state.tenancyType ||
            !state.currentSituation;

          if (missingRequiredFields) {
            router.push("/onboarding/personal-info");
          }
        } catch (e) {
          // If parsing fails, redirect to be safe
          router.push("/onboarding/personal-info");
        }
      }
    };

    checkRequiredFields();

    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, [
    termsAndConditions,
    form,
    router,
    useOnboardingState.persist?.hasHydrated,
  ]);

  const onSubmit = async (data: OnboardingTermsAndConditionsSchema) => {
    setIsLoading(true); // Show loading when submitting
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Update local state
      setData(data);

      // Prepare the complete form data
      const completeFormData = { ...onboardingData, ...data };

      // Submit to API
      const response = await fetch("/api/submitForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeFormData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit form");
      }

      // Handle success
      setSubmitSuccess(true);
      console.log("Form submitted successfully:", result);

      // Redirect after successful submission
      setTimeout(() => {
        router.push("/onboarding/success");
      }, 1000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setIsLoading(true); // Show loading when navigating back
    router.push("/onboarding/additional-info");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MobileFormContainer
      title="Terms & Conditions"
      backUrl="/onboarding/additional-info"
      step={3}
      totalSteps={3}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-sm">
              <h2 className="font-medium mb-2">Terms and Conditions</h2>
              <p className="mb-2">
                By submitting this form, you agree to the following terms:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All information provided is accurate and complete</li>
                <li>You consent to the processing of your personal data</li>
                <li>
                  You understand that false information may result in legal
                  consequences
                </li>
                <li>
                  You agree to notify us of any changes to your information
                </li>
              </ul>
              <p className="mt-2 text-muted-foreground">
                Please read our full{" "}
                <a href="#" className="text-primary underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary underline">
                  Terms of Service
                </a>{" "}
                for more information.
              </p>
            </div>

            {submitError && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Submission Error</p>
                  <p className="text-sm">{submitError}</p>
                </div>
              </div>
            )}

            {submitSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-600 flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Success!</p>
                  <p className="text-sm">
                    Your form has been submitted successfully.
                  </p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="termsAndConditions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-base">
                      I have read and accept the terms and conditions
                    </FormLabel>
                    <FormDescription className="text-sm">
                      You must accept the terms to complete your registration
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t mt-8 flex gap-2">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </MobileFormContainer>
  );
};
