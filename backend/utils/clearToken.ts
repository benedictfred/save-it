import { Response } from "express";

export default function clearToken(res: Response) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "none",
    partitioned: true,
  });
}
