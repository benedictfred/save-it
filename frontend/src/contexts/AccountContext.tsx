import { createContext, useContext, useState } from "react";
import { TransferFormData } from "../components/TransferForm";
import { useTransactionStream } from "../hooks/useTransactionStream";

type AccountContextType = {
  transferData: TransferFormData;
  setTransferData: React.Dispatch<React.SetStateAction<TransferFormData>>;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

function AccountProvider({ children }: { children: React.ReactNode }) {
  useTransactionStream();
  const [transferData, setTransferData] = useState<TransferFormData>(
    {} as TransferFormData
  );

  return (
    <AccountContext.Provider
      value={{
        transferData,
        setTransferData,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within a AccountProvider");
  }
  return context;
}

export { AccountProvider, useAccount };
