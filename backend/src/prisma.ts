import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcrypt";

export const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
      passwordChangedAt: true,
      pin: true,
      createdAt: true,
      updatedAt: true,
      resetToken: true,
      resetTokenExpiry: true,
    },
    transaction: {
      userId: true,
    },
  },
})
  .$extends({
    query: {
      user: {
        // @ts-ignore
        async create({ model, operation, args, query }) {
          const hashedPassword = await bcrypt.hash(args.data.password, 12);
          args.data = {
            ...args.data,
            password: hashedPassword,
            accountNumber:
              args.data.phoneNumber.length > 10
                ? args.data.phoneNumber.slice(1)
                : args.data.phoneNumber,
          };

          return query(args);
        },
      },
    },
  })
  .$extends(withAccelerate());
