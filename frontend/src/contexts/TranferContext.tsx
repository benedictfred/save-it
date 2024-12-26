import React, { createContext, useContext, useState } from "react";
import { TransferFormData } from "../components/TransferForm";
import { CustomError, TransferAmount } from "../utils/types";

type TransferContextType = {
  transferData: TransferFormData;
  setTransferData: React.Dispatch<React.SetStateAction<TransferFormData>>;
  recipientName: string;
  setRecipientName: React.Dispatch<React.SetStateAction<string>>;
  getRecipientName: (number: string) => Promise<string | null>;
  transferAmount: (
    data: TransferAmount
  ) => Promise<{ status: "success" | "error"; message: string }>;
};

const TransferContext = createContext<TransferContextType | undefined>(
  undefined
);

function TransferProvider({ children }: { children: React.ReactNode }) {
  const [transferData, setTransferData] = useState<TransferFormData>(
    {} as TransferFormData
  );
  const [recipientName, setRecipientName] = useState("");

  async function getRecipientName(number: string): Promise<string | null> {
    try {
      const response = await fetch(`http://localhost:8000/recipient/${number}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.text();
      setRecipientName(data);
      return null;
    } catch (error) {
      const customError = error as CustomError;
      return customError.message;
    }
  }

  async function transferAmount(
    data: TransferAmount
  ): Promise<{ status: "success" | "error"; message: string }> {
    try {
      const response = await fetch("http://localhost:8000/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      return { status: "success", message: responseData.message };
    } catch (error) {
      const customError = error as CustomError;
      return { status: "error", message: customError.message };
    }
  }

  return (
    <TransferContext.Provider
      value={{
        transferData,
        setTransferData,
        recipientName,
        getRecipientName,
        setRecipientName,
        transferAmount,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
}

function useTransfer() {
  const context = useContext(TransferContext);
  if (!context) {
    throw new Error("useTransfer must be used within a TransferProvider");
  }
  return context;
}

export { TransferProvider, useTransfer };
