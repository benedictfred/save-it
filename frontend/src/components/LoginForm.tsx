import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAccount } from "../contexts/AccountContext";

export type LoginFormData = {
  phoneNumber: string;
  password: string;
};
export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BASE_URL;

  const { login, setUser } = useAccount();

  const onSubmit = async (data: LoginFormData) => {
    const { status, message, user } = await login(data);

    if (status === "success" && user) {
      toast.success(message);

      const expiryTime = new Date().getTime() + 60 * 60 * 1000;
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("expiry", expiryTime.toString());

      // Fetch the full user data immediately after login
      const fetchedUser = await fetch(`${API_URL}/users/${user.id}`)
        .then((response) => response.json())
        .catch((err) => {
          toast.error("Failed to fetch user data");
          console.error(err);
        });

      if (fetchedUser) {
        setUser(fetchedUser);
        navigate("/home", { replace: true });
      }
    } else if (status === "error") {
      toast.error(message);
    }
  };

  return (
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
        <input
          type="password"
          id="password"
          className="p-3 w-full border rounded-md outline-none text-black"
          placeholder="Enter your password"
          {...register("password", { required: "Password is required" })}
        />
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
      <p className="text-center text-blue-500">Forgot Password ?</p>
    </form>
  );
}
