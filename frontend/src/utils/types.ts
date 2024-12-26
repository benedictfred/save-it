export type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  balance: number;
  transactions: Transaction[] | [];
};

export type Transaction = {
  id: number;
  amount: number;
  type: "deposit" | "transfer";
  date: string;
  sender: string;
  receiver: string;
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
  senderNumber: string;
};
