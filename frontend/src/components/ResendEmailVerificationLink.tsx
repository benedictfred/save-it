import { useState } from "react";
import { useTimer } from "../hooks/useTimer";
import { resendVerificationEmail } from "../services/authService";
import { toast } from "react-toastify";

export default function ResendEmailVerificationLink() {
  const { timeLeft, setTimeLeft } = useTimer(60);
  const [isLoading, setIsLoading] = useState(false);

  async function handleResend() {
    setTimeLeft(60);
    try {
      setIsLoading(true);
      const { message } = await resendVerificationEmail();
      toast.success(message || "Verification email resent successfully");
    } catch (error) {
      toast.error(
        (error as Error).message || "Failed to resend verification email"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex flex-col justify-center items-center h-screen space-y-6 max-w-md mx-auto text-center">
      <div>
        <img src="/space.svg" alt="Space" className="w-40 h-40" />
      </div>
      <div>
        <h2>Resend Email Verification Link</h2>
        <p>
          If you didn't receive the email, click the button below to resend it.
        </p>
        <button
          type="submit"
          className="p-3 mt-3 bg-primary rounded-md w-full text-black disabled:bg-gray-500 disabled:cursor-not-allowed"
          onClick={handleResend}
          disabled={timeLeft > 0 || isLoading}
        >
          Send Email {timeLeft > 0 && `(${timeLeft})`}
        </button>
      </div>
    </section>
  );
}
