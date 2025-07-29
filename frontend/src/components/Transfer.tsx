import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAccount } from "../contexts/AccountContext";
import { useTransfer } from "../contexts/TranferContext";
import { toast } from "react-toastify";

export default function Transfer() {
  const [firstPin, setFirstPin] = useState("");
  const { user, fetchUser } = useAccount();
  const { setPin } = useTransfer();

  async function handleSetPin() {
    const { status, message } = await setPin({
      pin: firstPin,
    });

    if (status === "success") {
      toast.success(message);
      fetchUser();
    }
    if (status === "fail" || status === "error") {
      toast.error(message);
    }
  }
  return (
    <section className="w-full p-5 overflow-y-auto">
      <p>Send Money</p>
      <div className="flex flex-col space-y-3 justify-center items-center py-7">
        <Outlet />

        {!user?.hasPin && (
          <div className="absolute bg-black/50 backdrop-blur-sm inset-0 flex justify-center items-center z-50">
            <div className="bg-black bg-opacity-50 flex justify-center items-center z-10">
              <div className="bg-black p-5 rounded-md">
                <p className="text-xl">Set your transaction pin first</p>
                <input
                  type="password"
                  className="w-full border rounded-md py-2 px-2 mt-3 text-black outline-none"
                  placeholder="Enter your 4-digit pin"
                  maxLength={4}
                  value={firstPin}
                  onChange={(e) => setFirstPin(e.target.value)}
                />
                <button
                  className="bg-primary text-black py-2 px-4 rounded-md w-full mt-3"
                  onClick={handleSetPin}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
