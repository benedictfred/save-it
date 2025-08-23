import { LoginFormData } from "../components/LoginForm";
import { ResetPasswordData } from "../components/ResetPasswordForm";
import { SignUpFormData } from "../components/SignUpForm";
import { API_URL } from "../utils/constants";
import { setPinData, User } from "../utils/types";

interface LoginResponse {
  status: "success" | "fail" | "error";
  message: string;
  user: Partial<User>;
}

interface SignUpResponse {
  status: "success" | "fail" | "error";
  message: string;
}

interface ApiResponse {
  status: "success" | "fail" | "error";
  message: string;
}

export async function loginUser(
  payload: LoginFormData
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function registerUser(
  payload: SignUpFormData
): Promise<SignUpResponse> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function logout() {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json();
}

export async function forgotPassword(payload: {
  email: string;
}): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "User with this email was not found");
  }

  return data;
}

export async function resetPassword(
  payload: ResetPasswordData,
  token: string
): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/auth/reset-password/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "This token is invalid");
  }

  return data;
}

export async function setPin(payload: setPinData): Promise<ApiResponse> {
  const response = await fetch(`${API_URL}/auth/pin`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Pin was not set");
  }

  return responseData;
}

export async function verifyEmail(token: string): Promise<ApiResponse> {
  const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Email verification failed");
  }

  return responseData;
}

export async function verifyPhone(otp: string): Promise<ApiResponse> {
  const response = await fetch(`${API_URL}/auth/verify-phone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp }),
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Phone verification failed");
  }

  return responseData;
}

export async function resendVerificationEmail(): Promise<ApiResponse> {
  const response = await fetch(`${API_URL}/auth/resend-verification-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Email was not sent");
  }

  return responseData;
}

export async function resendOtp(): Promise<ApiResponse> {
  const response = await fetch(`${API_URL}/auth/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "OTP was not sent");
  }

  return responseData;
}
