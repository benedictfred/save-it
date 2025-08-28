import { useState, useRef, useEffect, useCallback } from "react";
import { useTimer } from "../hooks/useTimer";
import { IoMdRefresh, FaArrowLeft } from "../utils/icons";
import { useVerifyOtp } from "../hooks/useVerifyOtp";
import { resendOtp } from "../services/authService";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function OtpForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const { timeLeft, setTimeLeft } = useTimer(0);
  const { mutate: verifyOtp, isPending } = useVerifyOtp();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  const sendOtp = useCallback(async () => {
    setIsLoading(true);
    try {
      const { message } = await resendOtp();
      toast.success(message || "OTP resent successfully");
      setTimeLeft(60);
    } catch (error) {
      toast.error((error as Error).message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setTimeLeft]);

  // Runs immediately on mount
  useEffect(() => {
    const initialize = async () => {
      if (user?.phoneVerified) {
        navigate("/home", { replace: true });
        return;
      }

      await sendOtp();

      inputRefs.current = inputRefs.current.slice(0, 6);
    };

    initialize();
  }, [user, navigate, sendOtp]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    // Handle pasted content
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || "";
      }
      setOtp(newOtp);

      // Focus on the last filled input or next empty one
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Move to next input if current is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        // Clear current input
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasteData[i] || "";
    }

    setOtp(newOtp);
    setError("");

    const lastIndex = Math.min(pasteData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");

    verifyOtp(otpString);
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setError("");

    await sendOtp();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1B1B1B] rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <button className="mb-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FaArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-50 mb-2">Verify OTP</h1>
          <p className="text-gray-400">
            Enter the 6-digit code sent to your phone number
          </p>
          <p className="text-sm font-medium text-gray-50 mt-2">
            {user?.phoneNumber?.slice(0, 4)} *** ***
            {user?.phoneNumber?.slice(-3)}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-center space-x-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none transition-colors ${
                  digit
                    ? "border-primary bg-primary/10"
                    : error
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending || otp.join("").length !== 6}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-black transition-all ${
            isPending || otp.join("").length !== 6
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary hover:bg-[#b8e529] active:scale-[0.98]"
          }`}
        >
          {isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <IoMdRefresh className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={timeLeft > 0}
            className={`font-medium transition-colors ${
              timeLeft > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-primary hover:text-[#b8e529]"
            }`}
          >
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend OTP"}
          </button>
        </div>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            💡 <strong>Tip:</strong> You can paste your OTP directly into any
            input field
          </p>
        </div>
      </div>
      {isLoading && <Loader />}
    </div>
  );
}
