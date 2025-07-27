import { login, protect, signUp } from "@/controllers/auth.controller";
import { createUser, getAllUsers } from "@/controllers/user.controller";
import { Router } from "express";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);

router.route("/").post(createUser).get(protect, getAllUsers);

export default router;
