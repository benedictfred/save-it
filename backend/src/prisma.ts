import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";

export const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
      passwordChangedAt: true,
      pin: true,
    },
  },
}).$extends({
  query: {
    user: {
      async create({ model, operation, args, query }) {
        const hashedPassword = await bcrypt.hash(args.data.password, 12);
        args.data = { ...args.data, password: hashedPassword };

        return query(args);
      },
    },
  },
});
