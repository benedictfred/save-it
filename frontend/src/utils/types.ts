export type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  pin: string;
  password: string;
  balance: number;
  transactions: Transaction[] | [];
};

export type Transaction = {
  id: number;
  amount: number;
  type: "credit" | "debit";
  date: string;
  recipientNumber: string;
  recipientName: string;
  senderNumber: string;
  senderName: string;
  transaction?: Transaction;
};

export type LoginUserData = {
  id: number;
  email: string;
};

export type CustomError = {
  code: string;
  message: string;
};

export type TransferAmount = {
  amount: number;
  recipientName: string;
  recipientNumber: string;
  senderNumber?: string;
};

export type setPinData = {
  phoneNumber: string | undefined;
  pin: string | undefined;
};
