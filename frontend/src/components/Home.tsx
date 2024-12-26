import { useAccount } from "../contexts/AccountContext";
import { formatCurrency, truncateName } from "../utils/helpers";
import Transactions from "./Transactions";

export default function Home() {
  const { user } = useAccount();
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
        <div className="flex justify-between mb-3 mt-3">
          <p>Recent Transactions</p>
          <p>See All</p>
        </div>
        <div className="divide-y divide-gray-400 space-y-4">
          <Transactions />
          <Transactions />
        </div>
      </div>
    </section>
  );
}
