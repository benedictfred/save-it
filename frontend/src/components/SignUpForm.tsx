import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "../utils/icons";
import { useRegister } from "../hooks/useRegister";
import Loader from "./Loader";

export type SignUpFormData = {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>();

  const { mutate: registerUser, isPending } = useRegister();

  const onSubmit = async (data: SignUpFormData) => {
    registerUser(data);
  };
  return (
    <form
      className="flex flex-col gap-y-4 lg:w-[50%] 2xl:w-[35%] w-[90%] md:w-[70%]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-y-2">
        <label htmlFor="name" className="text-left">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          className="p-3 w-full border rounded-md outline-none text-black"
          placeholder="Enter your full name"
          {...register("name", { required: "Full name is required" })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="email" className="text-left">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="p-3 w-full border rounded-md outline-none text-black"
          placeholder="Enter your email address"
          {...register("email", { required: "Email address is required" })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
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
              pattern: {
                value: /^(0\d{10}|\d{10})$/,
                message:
                  "Phone number must be 10 digits or 11 digits with leading 0",
              },
              setValueAs: (value: string) => value.replace(/^0/, ""),
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
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <span
            className="absolute text-black right-3 top-3 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaRegEye size={25} />
            ) : (
              <FaRegEyeSlash size={25} />
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
            placeholder="Enter your password again"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          <span
            className="absolute text-black right-3 top-3 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <FaRegEye size={25} />
            ) : (
              <FaRegEyeSlash size={25} />
            )}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        className="p-3 mt-3 bg-primary rounded-md w-full text-black"
        disabled={isSubmitting}
      >
        Sign Up
      </button>
      <div className="flex justify-center items-center space-x-2">
        <span>Already have an account ?</span>
        <Link to="/sign-in" className="text-blue-500">
          Sign In
        </Link>
      </div>
      {isPending && <Loader />}
    </form>
  );
}
