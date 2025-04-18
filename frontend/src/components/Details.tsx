import { Navigate, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/helpers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTransfer } from "../contexts/TranferContext";
import { useAccount } from "../contexts/AccountContext";

export default function Details() {
  const { getUser, user } = useAccount();
  const { transferData, transferAmount } = useTransfer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPin, setUserPin] = useState("");
  const navigate = useNavigate();
  const { setPin } = useTransfer();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = true;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleConfirmTransaction = async () => {
    const { status: pinStatus } = await setPin({
      pin: userPin,
      phoneNumber: user?.phoneNumber,
    });
    if (pinStatus === "success") {
      const { message, status } = await transferAmount(transferData);
      if (status === "success") {
        toast.success(message);
        getUser();
        return navigate("/transfer");
      }

      if (status === "error") {
        toast.error(message);
      }
      setUserPin("");
      setIsModalOpen(false);
    } else {
      toast.error("Invalid PIN");
    }
  };

  if (
    !transferData.amount ||
    !transferData.recipientNumber ||
    !transferData.recipientName
  ) {
    return <Navigate to="/transfer" />;
  }

  return (
    <div className=" relative flex flex-col space-y-7 justify-center items-center py-10">
      <p className="text-xl">Confirm Details</p>
      <p>Make sure the details below are correct when sending the money</p>
      <p className="text-primary text-xl font-bold">
        {formatCurrency(transferData.amount)}
      </p>
      <div className="w-full space-y-4 py-5">
        <div className="flex justify-between items-center px-2">
          <p>Account Name</p>
          <p className="text-gray-300">{transferData.recipientName}</p>
        </div>
        <div className="flex justify-between items-center px-2">
          <p>Account No</p>
          <p className="text-gray-300">{transferData.recipientNumber}</p>
        </div>
      </div>
      <button
        className="bg-primary text-black py-2 px-4 rounded-md w-full"
        onClick={() => setIsModalOpen(true)}
      >
        Send Money
      </button>

      {/* Modal */}
      <div
        className={`absolute bg-black/50 backdrop-blur-sm inset-0 flex justify-center items-center z-50 ${
          isModalOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className="bg-black bg-opacity-50 flex justify-center items-center z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-black p-5 rounded-md">
            <p className="text-xl">Enter your pin to confirm</p>
            <input
              type="password"
              className="w-full border rounded-md py-2 px-2 mt-3 text-black outline-none"
              placeholder="Enter your pin"
              maxLength={4}
              value={userPin}
              onChange={(e) => setUserPin(e.target.value)}
            />
            <button
              className="bg-primary text-black py-2 px-4 rounded-md w-full mt-3"
              onClick={handleConfirmTransaction}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
