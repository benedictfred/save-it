import { Response } from "express";

export default function sendToken(res: Response, token: string) {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    sameSite: "none",
    partitioned: true,
  });
}
