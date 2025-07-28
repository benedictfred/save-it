import z from "zod";

export const transferSchema = z.object({
  recipientAccNumber: z.string().length(10),
  amount: z.number().positive(),
  pin: z.string().length(4),
});

export type TransferInput = z.infer<typeof transferSchema>;

export const pinSchema = z.object({
  pin: z.string().length(4, "pin must be 4 characters"),
});
