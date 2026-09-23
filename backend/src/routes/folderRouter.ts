import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { isAuthenticated } from "../middleware/authGuard";
import {
  createFolder,
  getFolders,
  getFolder,
  updateFolder,
  deleteFolder,
} from "../controllers/folderController";

const folderRouter = Router();

folderRouter.use(isAuthenticated);

folderRouter.post("/", createFolder);

folderRouter.get("/", getFolders);

folderRouter.get("/:id", getFolder);

folderRouter.put("/:id", updateFolder);

folderRouter.delete("/:id", deleteFolder);

export default folderRouter;
