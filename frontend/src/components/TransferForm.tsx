import { useForm } from "react-hook-form";
import { TbCurrencyNaira } from "../utils/icons";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTransfer } from "../contexts/TranferContext";
import { useAccount } from "../contexts/AccountContext";

export type TransferFormData = {
  amount: number;
  recipientNumber: string;
  recipientName: string;
  senderNumber?: string;
  senderName?: string;
};

export default function TransferForm() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<TransferFormData>();
  const { setTransferData, getRecipientName, recipientName, setRecipientName } =
    useTransfer();
  const { user } = useAccount();
  const navigate = useNavigate();

  const handleChange = async (e: React.FocusEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.trim();
    if (phoneNumber.length < 10) {
      setRecipientName("");
      return null;
    }
    const error = await getRecipientName(phoneNumber);
    if (error) {
      setError("recipientNumber", { type: "manual", message: error });
    } else {
      clearErrors("recipientNumber");
    }
  };

  useEffect(() => {
    setValue("recipientName", recipientName || "");
  }, [setValue, recipientName]);

  function onSubmit(data: TransferFormData) {
    const newData = {
      ...data,
      senderNumber: user?.phoneNumber,
      senderName: user?.name,
    };
    setTransferData(newData);
    setRecipientName("");
    navigate("/transfer/confirm-details");
  }
  return (
    <>
      <p className="text-xl">Send to Save It User</p>
      <form
        className="w-[80%] md:w-1/2 space-y-5 2xl:w-2/6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-2">
          <label htmlFor="amount">Amount to Send</label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              className="text-black py-2 pl-7 w-full border rounded-md outline-none"
              placeholder="Enter amount"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 10, message: "Amount must be greater than 9" },
              })}
            />
            <TbCurrencyNaira size={20} className="absolute top-2 text-black" />
          </div>
          {errors.amount && (
            <p className="text-red-500">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="number">Recipent Phone Number</label>
          <input
            type="tel"
            id="number"
            className="text-black py-2 pl-2 w-full border rounded-md outline-none"
            maxLength={10}
            placeholder="Enter phone number"
            {...register("recipientNumber", {
              required: "Account No is required",
              onChange: handleChange,
            })}
          />
          <p className="uppercase text-gray-400">{recipientName || null}</p>
          <input type="hidden" {...register("recipientName")} />
          {errors.recipientNumber && (
            <p className="text-red-500">{errors.recipientNumber.message}</p>
          )}
        </div>
        <button className="p-3 mt-3 w-full bg-primary rounded-md  text-black">
          Continue
        </button>
      </form>
    </>
  );
}
