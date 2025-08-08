import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import userRouter from "@/routes/user.routes";
import authRouter from "@/routes/auth.routes";
import transactionRouter from "@/routes/transaction.routes";
import notificationRouter from "@/routes/notification.route";
import AppError from "@/utils/appError";
import globalErrorHandler from "@/middlewares/error.middleware";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined"));
}

const PORT = process.env.PORT || 8000;

app.use("/api/v2/auth", authRouter);
app.use("/api/v2/users", userRouter);
app.use("/api/v2/transactions", transactionRouter);
app.use("/api/v2/notifications", notificationRouter);

app.get("/", (req, res) => res.send("Api is up and running"));

app.use(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `The route ${req.originalUrl} was not found on the server`,
      404
    )
  );
});

app.use(globalErrorHandler);

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

export default app;
