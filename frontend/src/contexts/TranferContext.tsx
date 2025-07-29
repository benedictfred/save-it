import React, { createContext, useContext, useState } from "react";
import { TransferFormData } from "../components/TransferForm";
import { CustomError, setPinData, TransferAmount } from "../utils/types";
import { useAccount } from "./AccountContext";

type TransferContextType = {
  transferData: TransferFormData;
  setTransferData: React.Dispatch<React.SetStateAction<TransferFormData>>;
  recipientName: string;
  setRecipientName: React.Dispatch<React.SetStateAction<string>>;
  getRecipientName: (number: string) => Promise<string | null>;
  transferAmount: (
    data: TransferAmount
  ) => Promise<{ status: "success" | "fail" | "error"; message: string }>;
  setPin: (
    data: setPinData
  ) => Promise<{ status: "success" | "fail" | "error"; message: string }>;
};

const TransferContext = createContext<TransferContextType | undefined>(
  undefined
);

function TransferProvider({ children }: { children: React.ReactNode }) {
  const [transferData, setTransferData] = useState<TransferFormData>(
    {} as TransferFormData
  );
  const [recipientName, setRecipientName] = useState("");
  const { setIsLoading } = useAccount();
  const API_URL = import.meta.env.VITE_BASE_URL;

  async function getRecipientName(
    accountNumber: string
  ): Promise<string | null> {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/users/${accountNumber}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("User not found");
      }
      const { data } = await response.json();
      setRecipientName(data?.name);
      return null;
    } catch (error) {
      const customError = error as CustomError;
      return customError.message;
    } finally {
      setIsLoading(false);
    }
  }

  async function transferAmount(
    data: TransferAmount
  ): Promise<{ status: "success" | "fail" | "error"; message: string }> {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/transaction/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { status: errorData?.status, message: errorData?.message };
      }

      const responseData = await response.json();
      return { status: responseData.status, message: responseData.message };
    } catch (error) {
      const customError = error as CustomError;
      return { status: customError.status, message: customError.message };
    } finally {
      setIsLoading(false);
    }
  }

  async function setPin(
    data: setPinData
  ): Promise<{ status: "success" | "fail" | "error"; message: string }> {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/auth/pin`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { status: errorData.status, message: errorData.message };
      }

      const responseData = await response.json();
      return { status: responseData.status, message: responseData.message };
    } catch (error) {
      const customError = error as CustomError;
      return { status: customError.status, message: customError.message };
    } finally {
      setIsLoading(false);
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
        setPin,
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
