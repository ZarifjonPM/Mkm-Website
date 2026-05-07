import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().optional(),
  phone: z.string().min(9).max(20),
  email: z.string().email().or(z.literal("")).optional(),
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

export const serviceFormSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Must be kebab-case"),
  icon: z.string().min(1).max(40),
  titleRu: z.string().min(2).max(200),
  titleUz: z.string().min(2).max(200),
  descriptionRu: z.string().min(2),
  descriptionUz: z.string().min(2),
  image: z.string().optional().default(""),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const partnerFormSchema = z.object({
  name: z.string().min(1).max(200),
  logo: z.string().min(1, "Logo is required"),
  url: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const siteSettingsSchema = z.object({
  phone1: z.string().min(5).max(40),
  phone2: z.string().max(40).optional().default(""),
  email: z.string().email().or(z.literal("")).optional().default(""),
  addressRu: z.string().min(2).max(300),
  addressUz: z.string().min(2).max(300),
  mapEmbedUrl: z.string().max(2000).optional().default(""),
  telegramUrl: z.string().max(300).optional().default(""),
  instagramUrl: z.string().max(300).optional().default(""),
  whatsappUrl: z.string().max(300).optional().default(""),
  workingHoursRu: z.string().max(200).optional().default(""),
  workingHoursUz: z.string().max(200).optional().default(""),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
export type PartnerFormData = z.infer<typeof partnerFormSchema>;
export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;
