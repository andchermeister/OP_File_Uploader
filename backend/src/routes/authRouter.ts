import { Router } from "express";
import { registerSchema } from "../schemas/authSchema";
import { validate } from "../middleware/validate";
import {
  signUp,
  signIn,
  verifyUser,
  signOut,
} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", validate(registerSchema), signUp);

authRouter.post("/signin", signIn);

authRouter.get("/me", verifyUser);

authRouter.post("/signout", signOut);

export default authRouter;
