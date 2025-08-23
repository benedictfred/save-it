import { useState } from "react";
import { useForm } from "react-hook-form";
import EmailSentModal from "./EmailSentModal";
import { useForgotPassword } from "../hooks/useForgotPassword";
import Loader from "./Loader";
import { useTimer } from "../hooks/useTimer";
import { formatCountdown } from "../utils/helpers";

interface ForgotPasswordData {
  email: string;
}

export default function ForgotPasswordForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { timeLeft, setTimeLeft } = useTimer(60);
  const { mutate: handleForgotPassword, isPending } = useForgotPassword();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>();

  const onSubmit = async (data: ForgotPasswordData) => {
    handleForgotPassword(data, {
      onSuccess: () => {
        setIsModalOpen(true);
        setTimeLeft(60);
      },
    });
  };

  return (
    <div className="max-w-md h-screen mx-auto space-y-6 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
        <input
          type="email"
          placeholder="Enter your registered email"
          className="p-3 w-full border rounded-md outline-none text-black"
          {...register("email", { required: "Email address is required" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        {timeLeft > 0 && (
          <div className="mt-4 text-right text-gray-700">
            Reset link expires in:{" "}
            <span className="font-bold">{formatCountdown(timeLeft)}</span>
          </div>
        )}
        <button
          type="submit"
          className="p-3 mt-3 bg-primary rounded-md w-full text-black disabled:bg-gray-500"
          disabled={isSubmitting || timeLeft > 0}
        >
          Send Reset Link
        </button>
      </form>
      {isPending && <Loader />}
      {isModalOpen && <EmailSentModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}
