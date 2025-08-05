import * as z from "zod";

export const NewRecipientSchema = z.object({
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
    .number({ error: "Amount must be a valid number." })
    .min(10, { error: "Amount must be at least 10." })
    .nonnegative({ error: "Amount must be a non-negative number." }),
  endDate: z
    .date({ error: "End date must be a valid date." })
    .min(new Date(), { error: "End date must be in the future." })
    .nonoptional({ error: "End date is required." }),
});
