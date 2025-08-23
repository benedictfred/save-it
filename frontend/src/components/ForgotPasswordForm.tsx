import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import EmailSentModal from "./EmailSentModal";
import { useForgotPassword } from "../hooks/useForgotPassword";
import Loader from "./Loader";

interface ForgotPasswordData {
  email: string;
}

export default function ForgotPasswordForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const { mutate: handleForgotPassword, isPending } = useForgotPassword();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordData>();

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const onSubmit = async (data: ForgotPasswordData) => {
    handleForgotPassword(data, {
      onSuccess: () => {
        setIsModalOpen(true);
        setTimer(60);
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
        {timer > 0 && (
          <div className="mt-4 text-right text-gray-700">
            Reset link expires in:{" "}
            <span className="font-bold">{formatTime(timer)}</span>
          </div>
        )}
        <button
          type="submit"
          className="p-3 mt-3 bg-primary rounded-md w-full text-black disabled:bg-gray-500"
          disabled={isSubmitting || timer > 0}
        >
          Send Reset Link
        </button>
      </form>
      {isPending && <Loader />}
      {isModalOpen && <EmailSentModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}
