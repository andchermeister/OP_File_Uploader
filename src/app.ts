import express from "express";
import authRouter from "./routes/authRoutes";
import dotenv from "dotenv";
import "./config/passport";
import passport from "./config/passport";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

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
