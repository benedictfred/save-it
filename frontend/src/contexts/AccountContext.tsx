import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchUser } from "../hooks/useFetchUser";
import { TransferFormData } from "../components/TransferForm";

type AccountContextType = {
  transferData: TransferFormData;
  setTransferData: React.Dispatch<React.SetStateAction<TransferFormData>>;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

function AccountProvider({ children }: { children: React.ReactNode }) {
  const [transferData, setTransferData] = useState<TransferFormData>(
    {} as TransferFormData
  );
  const { error } = useFetchUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const authPages = ["/sign-in", "/sign-up"];
    if (error && !authPages.includes(pathname)) {
      toast.error((error as Error).message);
      navigate("/sign-in", { replace: true });
    }
  }, [error, navigate, pathname]);

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
