import path from "node:path";
import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import mainRouter from "./routes/mainRouter";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

dotenv.config();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", mainRouter);

app.listen(PORT, (error?: Error) => {
  if (error) {
    throw error;
  }
  console.log(`app listening on port http://localhost:${PORT}`);
});
