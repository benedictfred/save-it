import AppError from "@/utils/appError";
import cloneError from "@/utils/cloneError";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

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

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = cloneError(err);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") error = handleKnownErrors(error);
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      error = handleValidationErrors();
    } else if (error instanceof Prisma.PrismaClientInitializationError) {
      error = handleDbInitError();
    }
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
