import { useAccount } from "../contexts/AccountContext";
import { formatCurrency, truncateName } from "../utils/helpers";
import { Transaction } from "../utils/types";
import Transactions from "./Transactions";
import Loader from "./Loader";
import { Link } from "react-router-dom";

export default function Home() {
  const { user } = useAccount();
  const slicedTransaction = user?.transactions.slice(0, 10);

  if (user === null) return <Loader />;
  return (
    <section className="w-full p-5 overflow-y-auto">
      <p>Home</p>
      <div
        className="flex justify-between bg-cover bg-no-repeat rounded-xl px-7 py-10 mt-3"
        style={{ backgroundImage: "url('/black-pattern.webp')" }}
      >
        <div className="space-y-3">
          <p className="text-sm">Welcome</p>
          <p className="text-2xl font-bold">
            {truncateName(user?.name as string)}
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm">Available Balance</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(user?.balance as number)}
          </p>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-3 mt-5">
          <p>Recent Transactions</p>
          <Link to="/history">See All</Link>
        </div>
        {user?.transactions?.length === 0 ? (
          <p className="text-center text-2xl text-gray-400 italic p-5">
            No Transactions Yet
          </p>
        ) : (
          <div className="divide-y divide-gray-400 space-y-4">
            {slicedTransaction?.map((transaction: Transaction) => (
              <Transactions transaction={transaction} key={transaction.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
