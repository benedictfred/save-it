import catchAsync from "../utils/catchAsync";
import { TransferInput, transferSchema } from "../validators/user.schema";
import { NextFunction, Request, Response } from "express";
import * as transactionService from "../services/transaction.service";
import { addClient } from "../utils/sse";

export const transfer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount, recipientAccNumber, pin }: TransferInput =
      transferSchema.parse(req.body);

    const transactionStatus = await transactionService.transfer({
      senderId: req.user!.id!,
      recipientAccNumber,
      pin,
      amount,
    });

    res.status(200).json({
      status: "success",
      message: "Transfer successful",
      data: transactionStatus,
    });
  }
);

export const getHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const transactions = await transactionService.getHistory(req.user!.id!);

    res.status(200).json({
      status: "success",
      data: transactions,
    });
  }
);

export const transactionEventHandler = (req: Request, res: Response) => {
  addClient(req.user?.id!, req, res);
};
