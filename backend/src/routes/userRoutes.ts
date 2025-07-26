import { signUp } from "@/controllers/authController";
import { createUser, transfer } from "@/controllers/userController";
import { Router } from "express";

const router = Router();

router.post("/signup", signUp);

router.route("/").post(createUser).get(transfer);

export default router;
