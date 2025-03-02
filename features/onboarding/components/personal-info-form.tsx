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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TitleOptions,
  MaritalStatusOptions,
  GenderOptions,
  CountryOptions,
} from "@/features/onboarding/constants";
import { useRouter } from "next/navigation";
import { useOnboardingState } from "@/features/onboarding/store";
import { Loading } from "@/components/ui/loading";
import { MobileFormContainer } from "@/components/ui/mobile-form-container";

const onboardingPersonalInfoSchema = onboardingSchema.pick({
  firstName: true,
  surname: true,
  title: true,
  email: true,
  phone: true,
  birthDate: true,
  gender: true,
  nino: true,
  birthPlace: true,
  addressLine1: true,
  addressLine2: true,
  addressLine3: true,
  postTown: true,
  postcode: true,
  country: true,
  maritalStatus: true,
});

type OnboardingPersonalInfoSchema = z.infer<
  typeof onboardingPersonalInfoSchema
>;

export const PersonalInfoForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const setData = useOnboardingState((state) => state.setData);
  const storedData = useOnboardingState();

  const form = useForm<OnboardingPersonalInfoSchema>({
    resolver: zodResolver(onboardingPersonalInfoSchema),
    defaultValues: {
      firstName: storedData.firstName || "",
      surname: storedData.surname || "",
      title: storedData.title || "",
      email: storedData.email || "",
      phone: storedData.phone || "",
      birthDate: storedData.birthDate || "",
      gender: storedData.gender || "",
      nino: storedData.nino || "",
      birthPlace: storedData.birthPlace || "united-kingdom",
      addressLine1: storedData.addressLine1 || "",
      addressLine2: storedData.addressLine2 || "",
      addressLine3: storedData.addressLine3 || "",
      postTown: storedData.postTown || "",
      postcode: storedData.postcode || "",
      country: storedData.country || "",
      maritalStatus: storedData.maritalStatus || "",
    },
  });

  // Update form when persisted data changes
  useEffect(() => {
    // Wait for hydration to complete before updating form values
    if (!useOnboardingState.persist?.hasHydrated) return;

    // Add a small delay to ensure loading screen is visible during navigation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    const fields = Object.keys(onboardingPersonalInfoSchema.shape) as Array<
      keyof OnboardingPersonalInfoSchema
    >;

    fields.forEach((field) => {
      if (storedData[field] !== undefined) {
        form.setValue(field, storedData[field] as any);
      }
    });

    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, [storedData, form, useOnboardingState.persist?.hasHydrated]);

  const onSubmit = (data: OnboardingPersonalInfoSchema) => {
    setIsLoading(true); // Show loading when navigating forward
    setData(data);
    router.push("/onboarding/additional-info");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MobileFormContainer
      title="Personal Information"
      showBackButton={false}
      step={1}
      totalSteps={3}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Basic Information</h2>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-2"
                    >
                      {TitleOptions.map((title) => (
                        <FormItem
                          key={title.value}
                          className="flex items-center space-x-2 space-y-0 rounded-md border p-2"
                        >
                          <FormControl>
                            <RadioGroupItem value={title.value} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {title.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@example.com"
                      {...field}
                      type="email"
                      inputMode="email"
                      autoCapitalize="none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="07700 900 900"
                      {...field}
                      type="tel"
                      inputMode="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Personal Details</h2>

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Input placeholder="DD/MM/YYYY" {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {GenderOptions.map((gender) => (
                        <FormItem
                          key={gender.value}
                          className="flex items-center space-x-3 space-y-0 rounded-md border p-3"
                        >
                          <FormControl>
                            <RadioGroupItem value={gender.value} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {gender.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MaritalStatusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
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
              name="nino"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National Insurance Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="AB123456C"
                      {...field}
                      autoCapitalize="characters"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where were you born?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a country..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CountryOptions.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
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
            <h2 className="text-lg font-medium">Address</h2>

            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Apartment, suite, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine3"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 3 (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Area, district, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="postTown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Town/City</FormLabel>
                    <FormControl>
                      <Input placeholder="London" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postcode</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SW1A 1AA"
                        {...field}
                        autoCapitalize="characters"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="United Kingdom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t mt-8">
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </MobileFormContainer>
  );
};
