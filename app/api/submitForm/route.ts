import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onboardingSchema } from "@/features/onboarding/schema";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the data against the schema
    const validatedData = onboardingSchema.parse(body);

    // Add the data to Firestore with a timestamp
    const docRef = await addDoc(collection(db, "onboardingForms"), {
      ...validatedData,
      createdAt: serverTimestamp(),
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      formId: docRef.id,
    });
  } catch (error) {
    console.error("Error submitting form:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit form",
      },
      { status: 500 }
    );
  }
}
