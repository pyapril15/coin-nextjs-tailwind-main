'use server'

import { z } from "zod"
import { contactSchema } from "@/lib/validations/auth"

export async function submitContactForm(data: z.infer<typeof contactSchema>) {
  const result = contactSchema.safeParse(data)
  
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors }
  }

  // Mocking database / email transmission (e.g. Resend, SendGrid)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  return { success: true, message: "Thanks for reaching out! We will be in touch shortly." }
}
