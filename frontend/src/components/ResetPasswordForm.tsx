import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useResetPassword } from "../hooks/useResetPassword";

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: handleResetPassword } = useResetPassword();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>();

  const onSumbit = async (data: ResetPasswordData) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    handleResetPassword(data);
  };

  return (
    <div className="max-w-md h-screen mx-auto space-y-6 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <form onSubmit={handleSubmit(onSumbit)} className="space-y-4 w-full">
        <div className="flex flex-col gap-y-2">
          <label htmlFor="password" className="text-left ">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="p-3 w-full border rounded-md outline-none text-black"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
            />
            <span
              className="absolute text-black right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaRegEyeSlash size={25} />
              ) : (
                <FaRegEye size={25} />
              )}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="confirmPassword" className="text-left ">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className="p-3 w-full border rounded-md outline-none text-black"
              placeholder="Enter your password"
              {...register("confirmPassword", {
                required: "Enter your password again",
              })}
            />
            <span
              className="absolute text-black right-3 top-3 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaRegEyeSlash size={25} />
              ) : (
                <FaRegEye size={25} />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="p-3 mt-3 bg-primary rounded-md w-full text-black"
          disabled={isSubmitting}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
