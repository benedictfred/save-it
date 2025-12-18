import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "../utils/icons";
import { useRegister } from "../hooks/useRegister";
import Loader from "./Loader";
import { formatNameToCapitalize } from "../utils/helpers";
import { signInWithGoogle } from "../firebase/firebase";
import { googleAuth } from "../services/authService";
import { toast } from "react-toastify";

export type SignUpFormData = {
  name: string;
  email: string;
  // phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>();

  const { mutate: registerUser, isPending } = useRegister();

  const onSubmit = async (data: SignUpFormData) => {
    registerUser({ ...data, name: formatNameToCapitalize(data.name) });
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      const { idToken } = await signInWithGoogle();
      await googleAuth(idToken);
      toast.success("Account created successfully!");
      navigate("/home");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign-up failed";
      toast.error(message);
    } finally {
      setIsGoogleLoading(false);
    }
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
      {/* <div className="flex flex-col gap-y-2">
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
      </div> */}
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

      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-gray-600"></div>
        <span className="text-gray-400 text-sm">OR</span>
        <div className="flex-1 h-px bg-gray-600"></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isGoogleLoading || isPending}
        className="flex items-center justify-center gap-3 bg-white text-gray-900 py-3 rounded-md w-full hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {isGoogleLoading ? "Signing up..." : "Continue with Google"}
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
