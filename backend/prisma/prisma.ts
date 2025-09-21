import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcrypt";

export const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
      passwordChangedAt: true,
      pin: true,
      phoneVerified: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    transaction: {
      userId: true,
    },
  },
})
  .$extends({
    query: {
      user: {
        async create({ model, operation, args, query }) {
          const hashedPassword = await bcrypt.hash(args.data.password, 12);
          args.data = {
            ...args.data,
            password: hashedPassword,
          };

          return query(args);
        },
      },
    },
  })
  .$extends(withAccelerate());
