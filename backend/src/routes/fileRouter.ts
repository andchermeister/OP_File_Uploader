import { Router } from "express";
import { isAuthenticated } from "../middleware/authGuard";
import { upload } from "../middleware/uploadEngine";
import {
  uploadFile,
  getFile,
  updateFile,
  deleteFile,
} from "../controllers/fileController";

const fileRouter = Router();
fileRouter.use(isAuthenticated);

fileRouter.post("/upload", upload.single("file"), uploadFile);

fileRouter.get("/", getFile);

fileRouter.put("/:id", updateFile);

fileRouter.delete("/:id", deleteFile);

export default fileRouter;
