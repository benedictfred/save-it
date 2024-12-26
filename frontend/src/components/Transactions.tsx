import { MdCallMade } from "../utils/icons";
import { formatCurrency } from "../utils/helpers";

export default function Transactions() {
  return (
    <div className="flex justify-between mt-3 pt-4">
      <div className="flex items-center space-x-3">
        <MdCallMade size={25} className="text-red-500" />
        <div className="space-y-1">
          <p className="text-lg">Sent</p>
          <p className="text-gray-400">1st jan, 08:32 - Nebolisa Nneka Agnes</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xl">{formatCurrency(52000)}</p>
        <p className="text-success italic">success</p>
      </div>
    </div>
  );
}
