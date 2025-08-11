import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "../utils/icons";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import Loader from "./Loader";

export type LoginFormData = {
  phoneNumber: string;
  password: string;
};
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();
  const { mutate: login, isPending } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <>
      <form
        className="flex flex-col gap-y-4 lg:w-[50%] 2xl:w-[35%] w-[90%] md:w-[70%]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-2">
          <label htmlFor="number" className="text-left">
            Phone Number
          </label>
          <div className="flex items-center gap-x-2 relative">
            <span className="p-3 bg-gray-200 border rounded-md absolute text-black">
              +234
            </span>
            <input
              type="tel"
              id="number"
              className="py-3 pl-20 border rounded-md w-full outline-none text-black"
              placeholder="Enter your phone number"
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>
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
        <button
          className="p-3 mt-3 bg-primary rounded-md w-full text-black"
          disabled={isSubmitting}
        >
          Sign In
        </button>
        <div className="flex justify-center items-center space-x-2">
          <span>{"Don't"} have an account ?</span>
          <Link to="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
        </div>
        <Link to="/forgot-password" className="text-center text-blue-500">
          Forgot Password ?
        </Link>
      </form>
      {isPending && <Loader />}
    </>
  );
}
