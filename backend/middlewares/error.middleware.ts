import AppError from "../utils/appError";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const handleKnownErrors = (err: any) => {
  const target = (err.meta?.target as string[])?.join(", ");
  const message = `Duplicate value for field(s): ${target}`;
  return new AppError(message, 400);
};

const handleValidationErrors = () => {
  const message = "Invalid input data.";
  return new AppError(message, 400);
};

const handleDbInitError = () => {
  const message = "Database initialization failed.";
  return new AppError(message, 500);
};

const handleZodErrors = (err: ZodError) => {
  const issues = err.issues.map((e) => `${e.path.join(".")}: ${e.message}`);
  const message = `Invalid input data. ${issues.join(" | ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: any, res: Response) => {
  if (err.isOperational) {
    // Operational , trusted errors; send to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming errors, came from bug or a library; send generic message to client
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log(err);
  console.log(process.env.DATABASE_URL);

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") err = handleKnownErrors(err);
    } else if (err instanceof Prisma.PrismaClientValidationError) {
      err = handleValidationErrors();
    } else if (err instanceof Prisma.PrismaClientInitializationError) {
      err = handleDbInitError();
    } else if (err instanceof ZodError) {
      err = handleZodErrors(err);
    }

    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;
