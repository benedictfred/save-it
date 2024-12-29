import { useAccount } from "../contexts/AccountContext";
import { Transaction } from "../utils/types";
import Transactions from "./Transactions";

export default function History() {
  const { user } = useAccount();
  return (
    <div>
      <h1 className="mt-8 ml-4">Transaction History</h1>
      <div className="divide-y divide-gray-400 space-y-4 px-10 mt-5">
        {user?.transactions?.map((transaction: Transaction) => (
          <Transactions transaction={transaction} key={transaction.id} />
        ))}
      </div>
    </div>
  );
}
