import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AppLayout from "./pages/AppLayout";
import Home from "./components/Home";
import Transfer from "./components/Transfer";
import Details from "./components/Details";
import TransferForm from "./components/TransferForm";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import History from "./components/History";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResendEmailPage from "./pages/ResendEmail";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyOtp from "./pages/VerifyOtp";

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/sign-in" />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/resend-email"
          element={
            <ProtectedRoute>
              <ResendEmailPage />
            </ProtectedRoute>
          }
        />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route
          path="/verify-phone"
          element={
            <ProtectedRoute>
              <VerifyOtp />
            </ProtectedRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="history" element={<History />} />
          <Route path="/transfer" element={<Transfer />}>
            <Route index element={<TransferForm />} />
            <Route path="confirm-details" element={<Details />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer aria-label="toast-message" className="max-md:w-[70%]" />
    </>
  );
}
