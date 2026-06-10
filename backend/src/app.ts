import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma";
import authRouter from "./routes/authRoutes";
import fileRouter from "./routes/fileRoute";
import folderRouter from "./routes/folderRoute";
import dotenv from "dotenv";
import "./config/passport";
import passport from "./config/passport";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super-secret-key-change-this-in-env",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/files", fileRouter);
app.use("/folders", folderRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the File Uploader",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

app.listen(PORT, (error?: Error) => {
  if (error) {
    throw error;
  }
  console.log(`app listening on port http://localhost:${PORT}`);
});
