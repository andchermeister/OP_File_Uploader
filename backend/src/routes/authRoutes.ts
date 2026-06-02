import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { registerSchema, loginSchema } from "../schemas/authSchema";
import { validate } from "../middleware/validate";

const authRouter = Router();

authRouter.post(
  "/signup",
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, email, password } = req.body;

    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ name: username }, { email: email }],
        },
      });

      if (existingUser) {
        res.status(409).json({
          status: "fail",
          message: "Username or email is already registered",
        });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          name: username,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.status(201).json({
        status: "success",
        message: "User registered successfully!",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  "/signin",
  validate(loginSchema),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);

      if (!user) {
        res.status(401).json({
          status: "fail",
          message: info?.message || "Invalid authentication credentials.",
        });
        return;
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) return next(loginErr);

        res.status(200).json({
          status: "success",
          message: "Signed in successfully!",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        });
      });
    })(req, res, next);
  },
);

authRouter.get("/me", (req: Request, res: Response) => {
  if (req.isAuthenticated() && req.user) {
    res.status(200).json({
      status: "success",
      user: {
        id: (req.user as any).id,
        name: (req.user as any).name,
        email: (req.user as any).email,
      },
    });
  } else {
    res.status(401).json({
      status: "fail",
      message: "Not authenticated",
    });
  }
});

authRouter.post(
  "/signout",
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err);

      req.session.destroy((sessionErr) => {
        if (sessionErr) return next(sessionErr);

        res.clearCookie("connect.sid", { path: "/" });

        res.status(200).json({
          status: "success",
          message: "Signed out successfully!",
        });
      });
    });
  },
);

export default authRouter;
