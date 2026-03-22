import z from "zod";

export const transferSchema = z.object({
  recipientAccNumber: z.string().length(10),
  amount: z.number().positive(),
  pin: z.string().length(4),
});

export type TransferDto = z.infer<typeof transferSchema>;
