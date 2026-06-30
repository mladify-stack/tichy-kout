import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(10, "Vzkaz musí mít alespoň 10 znaků")
    .max(500, "Vzkaz může mít maximálně 500 znaků"),
  signature: z
    .string()
    .max(100, "Podpis může mít maximálně 100 znaků")
    .optional()
    .nullable(),
  fontFamily: z.enum(["SERIF", "SANS", "HANDWRITING", "ELEGANT"]),
  textAlignment: z.enum(["LEFT", "CENTER", "RIGHT"]),
  postcardId: z.string().cuid(),
});

export const shippingSchema = z.object({
  recipientName: z.string().min(2, "Zadejte jméno příjemce"),
  street: z.string().min(3, "Zadejte ulici a číslo popisné"),
  city: z.string().min(2, "Zadejte město"),
  postalCode: z
    .string()
    .regex(/^\d{3}\s?\d{2}$/, "Zadejte platné PSČ (123 45)"),
  country: z.string().default("CZ"),
  customerEmail: z.string().email("Zadejte platný e-mail pro potvrzení"),
  phone: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Zadejte své jméno"),
  email: z.string().email("Zadejte platný e-mail"),
  message: z
    .string()
    .min(10, "Zpráva musí mít alespoň 10 znaků")
    .max(2000, "Zpráva je příliš dlouhá"),
});

export const aiTextSchema = z.object({
  category: z.enum([
    "PODĚKOVÁNÍ",
    "POVZBUZENÍ",
    "LÁSKA",
    "OMLOUVA",
    "VZPOMÍNKA",
    "JEN_TAK",
  ]),
  context: z.string().max(200).optional(),
});

export const adminOrderStatusSchema = z.object({
  orderId: z.string().cuid(),
  status: z.enum(["NEW", "PRINTED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export type MessageFormData = z.infer<typeof messageSchema>;
export type ShippingFormData = z.infer<typeof shippingSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
