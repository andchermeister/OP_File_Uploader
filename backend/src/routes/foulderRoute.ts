import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { isAuthenticated } from "../middleware/authGuard";

const folderRouter = Router();

folderRouter.use(isAuthenticated);

folderRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const currentUserId = (req.user as any).id;

      if (!name) {
        res
          .status(400)
          .json({ status: "fail", message: "Folder name is required." });
        return;
      }

      const newFolder = await prisma.folder.create({
        data: {
          name,
          userId: currentUserId,
        },
      });

      res.status(201).json({ status: "success", data: newFolder });
    } catch (error) {
      next(error);
    }
  },
);

folderRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = (req.user as any).id;

      const userFolders = await prisma.folder.findMany({
        where: { userId: currentUserId },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json({
        status: "success",
        data: userFolders,
      });
    } catch (error) {
      next(error);
    }
  },
);

folderRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const currentUserId = (req.user as any).id;

      const folder = await prisma.folder.findUnique({
        where: { id: Number(id) },
      });
      if (!folder || folder.userId !== currentUserId) {
        res.status(404).json({
          status: "fail",
          message: "Folder not found or user is unauthorised.",
        });
        return;
      }

      const updatedFolder = await prisma.folder.update({
        where: { id: Number(id) },
        data: { name },
      });

      res.status(200).json({
        status: "success",
        data: updatedFolder,
      });
    } catch (error) {
      next(error);
    }
  },
);

folderRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const currentUserId = (req.user as any).id;

      const folder = await prisma.folder.findUnique({
        where: { id: Number(id) },
      });

      if (!folder || folder.userId !== currentUserId) {
        res.status(404).json({
          status: "fail",
          message: "Folder not found or user is unauthorised.",
        });
        return;
      }

      await prisma.folder.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({
        status: "success",
        message: "Folder deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default folderRouter;
