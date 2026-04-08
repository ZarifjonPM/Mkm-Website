import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().optional(),
  phone: z.string().min(9).max(20),
  email: z.string().email().or(z.literal("")),
  message: z.string().min(2).max(2000),
});

export const quoteFormSchema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().min(2).max(200),
  phone: z.string().min(9).max(20),
  email: z.string().email().or(z.literal("")).optional(),
  message: z.string().min(10).max(2000),
  category: z.string().optional(),
  productName: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type QuoteFormData = z.infer<typeof quoteFormSchema>;
