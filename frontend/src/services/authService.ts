import { LoginFormData } from "../components/LoginForm";
import { SignUpFormData } from "../components/SignUpForm";
import { API_URL } from "../utils/constants";
import { User } from "../utils/types";

interface LoginResponse {
  status: "success" | "fail" | "error";
  message?: string;
  user: Partial<User>;
}

interface SignUpResponse {
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
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return res.json();
}
