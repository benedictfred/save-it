import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async create({ model, operation, args, query }) {
        const hashedPassword = await bcrypt.hash(args.data.password, 12);
        args.data = { ...args.data, password: hashedPassword };

        return query(args);
      },
    },
  },
  result: {
    user: {
      password: {
        needs: {},
        compute() {
          return undefined;
        },
      },
    },
  },
});
