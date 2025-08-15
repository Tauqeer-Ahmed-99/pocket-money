import * as z from "zod";

export const NewRecipientSchema = z.object({
  customerFirstName: z
    .string({ error: "Firstname must be a valid string." })
    .min(4, { error: "Firstname must be at least 4 characters long." })
    .max(100, { error: "Firstname must be at most 100 characters long." })
    .nonempty(),
  customerLastName: z
    .string({ error: "Lastname must be a valid string." })
    .min(4, { error: "Lastname must be at least 4 characters long." })
    .max(100, { error: "Lastname must be at most 100 characters long." })
    .nonempty(),
  customerEmail: z
    .email({ error: "Email must be a valid email address." })
    .nonempty(),
  customerPhone: z
    .string({ error: "Phone must be a valid phone number." })
    .min(10, { error: "Phone must be at least 10 characters long." })
    .max(15, { error: "Phone must be at most 15 characters long." })
    .nonempty(),
  firstName: z
    .string({ error: "Firstname must be a valid string." })
    .min(4, { error: "Firstname must be at least 4 characters long." })
    .max(100, { error: "Firstname must be at most 100 characters long." })
    .nonempty(),
  lastName: z
    .string({ error: "Lastname must be a valid string." })
    .min(4, { error: "Lastname must be at least 4 characters long." })
    .max(100, { error: "Lastname must be at most 100 characters long." })
    .nonempty(),
  email: z.email({ error: "Email must be a valid email address." }).nonempty(),
  phone: z
    .string({ error: "Phone must be a valid phone number." })
    .min(10, { error: "Phone must be at least 10 characters long." })
    .max(15, { error: "Phone must be at most 15 characters long." })
    .nonempty(),
  amount: z
    .string({ error: "Amount must be a valid string." })
    .regex(/^\d+(\.\d{1,2})?$/, {
      error: "Amount must be a valid number format.",
    })
    .refine((val) => parseFloat(val) >= 10, {
      error: "Amount must be at least 10.",
    })
    .refine((val) => parseFloat(val) >= 0, {
      error: "Amount must be a non-negative number.",
    }),
  endDate: z
    .date({ error: "End date must be a valid date." })
    .min(new Date(), { error: "End date must be in the future." })
    .nonoptional({ error: "End date is required." }),
});

export const ProfileSchema = z.object({
  firstname: z
    .string({ error: "Firstname must be a valid string." })
    .min(4, { error: "Firstname must be at least 4 characters long." })
    .max(100, { error: "Firstname must be at most 100 characters long." })
    .nonempty({ error: "Firstname is required." }),
  lastname: z
    .string({ error: "Lastname must be a valid string." })
    .min(4, { error: "Lastname must be at least 4 characters long." })
    .max(100, { error: "Lastname must be at most 100 characters long." })
    .nonempty({ error: "Lastname is required." }),
  email: z.email({ error: "Email must be a valid email address." }).nonempty(),
  phone: z
    .string({ error: "Phone must be a valid phone number." })
    .min(10, { error: "Phone must be at least 10 characters long." })
    .max(15, { error: "Phone must be at most 15 characters long." })
    .nonempty({ error: "Phone is required." }),
  addressLine1: z
    .string({ error: "Address Line 1 must be a valid string." })
    .min(4, { error: "Address Line 1 must be at least 4 characters long." })
    .max(100, { error: "Address Line 1 must be at most 100 characters long." })
    .nonempty({ error: "Address Line 1 is required." }),
  addressLine2: z
    .string({ error: "Address Line 2 must be a valid string." })
    .min(4, { error: "Address Line 2 must be at least 4 characters long." })
    .max(100, { error: "Address Line 2 must be at most 100 characters long." })
    .nonempty({ error: "Address Line 2 is required." }),
  city: z
    .string({ error: "City must be a valid string." })
    .min(2, { error: "City must be at least 2 characters long." })
    .max(100, { error: "City must be at most 100 characters long." })
    .nonempty({ error: "City is required." }),
  postalCode: z
    .string({ error: "Postal Code must be a valid string." })
    .min(6, { error: "Postal Code must be at least 6 characters long." })
    .max(6, { error: "Postal Code must be at most 6 characters long." })
    .nonempty({ error: "Postal Code is required." }),
  region: z
    .string({ error: "Region must be a valid string." })
    .min(2, { error: "Region must be at least 2 characters long." })
    .max(100, { error: "Region must be at most 100 characters long." })
    .nonempty({ error: "Region is required." }),
  country: z
    .string({ error: "Country must be a valid string." })
    .min(2, { error: "Country must be at least 2 characters long." })
    .max(100, { error: "Country must be at most 100 characters long." })
    .nonempty({ error: "Country is required." }),
});
