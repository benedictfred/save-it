import { MdCallMade, MdCallReceived } from "../utils/icons";
import { formatCurrency, formatDate, formatTime } from "../utils/helpers";
import { Transaction } from "../utils/types";

type TransactionProp = {
  transaction: Transaction;
};
export default function Transactions({ transaction }: TransactionProp) {
  return (
    <div className="flex justify-between mt-3 pt-4">
      <div className="flex items-center space-x-3">
        {transaction?.type === "credit" ? (
          <MdCallReceived size={25} className="text-green-500" />
        ) : (
          <MdCallMade size={25} className="text-red-500" />
        )}

        <div className="space-y-1">
          <p className="text-lg">
            {transaction?.type === "credit" ? "Recieved" : "Sent"}
          </p>
          <p className="text-gray-400">
            {formatDate(transaction?.date)}, {formatTime(transaction?.date)}{" "}
            &mdash;
            {transaction?.type === "credit"
              ? transaction?.senderName
              : transaction?.recipientName}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xl">{formatCurrency(transaction.amount)}</p>
        <p className="text-success italic">success</p>
      </div>
    </div>
  );
}
