import { useEffect, useState } from "react";
import { Transaction } from "../utils/types";
import Transactions from "./Transactions";
import { useAccount } from "../contexts/AccountContext";

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const { setIsLoading } = useAccount();
  const API_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    async function getHistory() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/transaction/history`, {
          credentials: "include",
        });
        const { data } = await res.json();
        setTransactions(data);
      } catch (err) {
        console.log("Something went wrong", err);
      } finally {
        setIsLoading(false);
      }
    }
    getHistory();
  }, [setIsLoading, API_URL]);

  return (
    <div className=" overflow-y-auto max-md:no-scrollbar pb-5">
      <h1 className="mt-8 ml-4">Transaction History</h1>
      {transactions?.length === 0 ? (
        <p className="text-center text-2xl text-gray-400 italic p-5">
          No Transactions Yet
        </p>
      ) : (
        <div className="divide-y divide-gray-400 space-y-4 px-8 mt-5 max-sm:px-5 ">
          {transactions?.map((transaction: Transaction) => (
            <Transactions transaction={transaction} key={transaction.id} />
          ))}
        </div>
      )}
    </div>
  );
}
