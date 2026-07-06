import { z } from "zod";
import { MAX_MESSAGE_LENGTH } from "./utils";

const textColorEnum = z.enum(["BLUE", "BLACK", "RED", "GREEN"]);

export const messageSchema = z.object({
  message: z
    .string()
    .min(10, "Vzkaz musí mít alespoň 10 znaků")
    .max(
      MAX_MESSAGE_LENGTH,
      `Vzkaz může mít maximálně ${MAX_MESSAGE_LENGTH} znaků`
    ),
  signature: z
    .string()
    .max(100, "Podpis může mít maximálně 100 znaků")
    .optional()
    .nullable(),
  textColor: textColorEnum.default("BLUE"),
  postcardId: z.string().cuid(),
});

export const shippingSchema = z.object({
  salutation: z.string().max(50, "Oslovení je příliš dlouhé").optional(),
  recipientName: z.string().min(2, "Zadejte jméno a příjmení příjemce"),
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
