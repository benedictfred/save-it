export type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  accountNumber: string;
  balance: number;
  hasPin: boolean;
  status:
    | "pending"
    | "active"
    | "email_verified"
    | "phone_verified"
    | "suspended";
  emailVerified: boolean;
  phoneVerified: boolean;
  transactions: Transaction[] | [];
  notifications: Notification[] | [];
  recentTransactions: Transaction[] | [];
  recentNotifications: Notification[] | [];
};

export type Transaction = {
  id: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
  status: "success" | "failed" | "pending";
  recipientName: string;
  recipientAccNumber: string;
  senderName: string;
  senderAccNumber: string;
};

export type Notification = {
  id: string;
  createdAt: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
};

export type LoginUserData = {
  id: number;
  email: string;
};

export type CustomError = {
  code: string;
  message: string;
  status: "success" | "fail" | "error";
};

export type TransferAmount = {
  amount: number;
  recipientAccNumber: string;
  pin: string;
};

export type setPinData = {
  pin: string;
};
