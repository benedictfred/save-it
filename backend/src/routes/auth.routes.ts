import { login, protect, setPin, signUp } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);
router.patch("/pin", protect, setPin);

export default router;
