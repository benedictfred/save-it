import { Response } from "express";

export function sendCookie(res: Response, token: string) {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    sameSite: "none",
    partitioned: true,
  });
}

export function clearCookie(res: Response) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "none",
    partitioned: true,
  });
}

export function sendAuthCookie(res: Response, token: string) {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 20 * 60 * 1000,
    path: "/",
    sameSite: "none",
    partitioned: true,
  });
}
