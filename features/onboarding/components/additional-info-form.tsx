"use client";

import { onboardingSchema } from "../schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useState } from "react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  NationalityOptions,
  ImmigrationStatusOptions,
  TenancyTypeOptions,
} from "@/features/onboarding/constants";
import { useRouter } from "next/navigation";
import { useOnboardingState } from "@/features/onboarding/store";
import { Loading } from "@/components/ui/loading";
import { MobileFormContainer } from "@/components/ui/mobile-form-container";

const onboardingAdditionalInfoSchema = onboardingSchema.pick({
  nationality: true,
  enteredUK: true,
  immigrationStatus: true,
  tenancyType: true,
  currentSituation: true,
});

type OnboardingAdditionalInfoSchema = z.infer<
  typeof onboardingAdditionalInfoSchema
>;

export const AdditionalInfoForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const setData = useOnboardingState((state) => state.setData);
  const storedData = useOnboardingState();

  const form = useForm<OnboardingAdditionalInfoSchema>({
    resolver: zodResolver(onboardingAdditionalInfoSchema),
    defaultValues: {
      nationality: storedData.nationality || "",
      enteredUK: storedData.enteredUK || "",
      immigrationStatus: storedData.immigrationStatus || "",
      tenancyType: storedData.tenancyType || "",
      currentSituation: storedData.currentSituation || "",
    },
  });

  // Update form when persisted data changes
  useEffect(() => {
    // Wait for hydration to complete before doing anything
    if (!useOnboardingState.persist?.hasHydrated) return;

    // Add a small delay to ensure loading screen is visible during navigation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    // Update form values from stored data
    const fields = Object.keys(onboardingAdditionalInfoSchema.shape) as Array<
      keyof OnboardingAdditionalInfoSchema
    >;

    fields.forEach((field) => {
      if (storedData[field] !== undefined) {
        form.setValue(field, storedData[field] as any);
      }
    });

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
            !state.maritalStatus;

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
  }, [storedData, form, router, useOnboardingState.persist?.hasHydrated]);

  const onSubmit = (data: OnboardingAdditionalInfoSchema) => {
    setIsLoading(true); // Show loading when navigating forward
    setData(data);
    router.push("/onboarding/terms-and-conditions");
  };

  const handleBack = () => {
    setIsLoading(true); // Show loading when navigating back
    router.push("/onboarding/personal-info");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MobileFormContainer
      title="Additional Information"
      backUrl="/onboarding/personal-info"
      step={2}
      totalSteps={3}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Immigration Details</h2>

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {NationalityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enteredUK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>When did you enter the UK?</FormLabel>
                  <FormControl>
                    <Input placeholder="DD/MM/YYYY" {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="immigrationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Immigration Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an immigration status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ImmigrationStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Housing Information</h2>

            <FormField
              control={form.control}
              name="tenancyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenancy Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a tenancy type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TenancyTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentSituation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Situation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please describe your current situation..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly describe your current living situation and any
                    relevant circumstances.
                  </FormDescription>
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
            >
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </MobileFormContainer>
  );
};
