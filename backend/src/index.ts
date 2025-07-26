import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import userRouter from "@/routes/userRoutes";
import { prisma } from "./prisma";
import AppError from "@/utils/appError";
import globalErrorHandler from "@/controllers/errorController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

app.use("/api/v2/users", userRouter);

app.get("/", async (req: Request, res: Response) => {
  const users = await prisma.user.create;
  res.status(200).send(users);
});

app.use(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `The route ${req.originalUrl} was not found on the server`,
      404
    )
  );
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
