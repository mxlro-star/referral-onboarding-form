import { z } from "zod";

import {
  TitleOptions,
  MaritalStatusOptions,
  GenderOptions,
  CountryOptions,
  NationalityOptions,
  ImmigrationStatusOptions,
  TenancyTypeOptions,
} from "./constants";

export const onboardingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  title: z.enum(
    TitleOptions.map((option) => option.value) as [string, ...string[]],
    {
      errorMap: () => ({ message: "Please select a title" }),
    }
  ),
  maritalStatus: z.enum(
    MaritalStatusOptions.map((option) => option.value) as [string, ...string[]],
    {
      errorMap: () => ({ message: "Please select a marital status" }),
    }
  ),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  birthDate: z.string().min(1, "Date of birth is required"),

  gender: z.enum(
    GenderOptions.map((option) => option.value) as [string, ...string[]],
    {
      errorMap: () => ({ message: "Please select a gender" }),
    }
  ),
  nino: z
    .string()
    .refine(
      (nino) =>
        /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z](?:\s?\d){6}\s?[A-D]$/i.test(
          nino
        ),
      "Invalid National Insurance Number"
    ),
  birthPlace: z.enum(
    CountryOptions.map((option) => option.value) as [string, ...string[]],
    {
      errorMap: () => ({ message: "Please select a birth place" }),
    }
  ),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  addressLine3: z.string().optional(),
  postTown: z.string().min(1, "Post town is required"),
  postcode: z
    .string()
    .min(1, "Postcode is required")
    .refine(
      (value) => /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(value),
      "Please enter a valid UK postcode"
    ),
  country: z.string().min(1, "Country is required"),
  nationality: z.enum(
    NationalityOptions.map((option) => option.value) as [string, ...string[]],
    {
      errorMap: () => ({ message: "Please select a nationality" }),
    }
  ),
  enteredUK: z.string().min(1, "Please enter a valid date"),
  immigrationStatus: z.enum(
    ImmigrationStatusOptions.map((option) => option.value) as [
      string,
      ...string[]
    ],
    {
      errorMap: () => ({ message: "Please select an immigration status" }),
    }
  ),
  tenancyType: z.enum(
    TenancyTypeOptions.map((option) => option.value) as [string, ...string[]],
    {
      errorMap: () => ({ message: "Please select a tenancy type" }),
    }
  ),
  currentSituation: z.string().min(1, "Please select a current situation"),
  termsAndConditions: z.boolean().refine((value) => value, {
    message: "You must accept the terms and conditions",
  }),
});

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
