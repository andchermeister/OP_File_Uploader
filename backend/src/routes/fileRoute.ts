import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { isAuthenticated } from "../middleware/authGuard";

const fileRouter = Router();
fileRouter.use(isAuthenticated);

fileRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, url, size, folderId } = req.body;
      const currentUserId = (req.user as any).id;

      const newFile = await prisma.file.create({
        data: {
          name,
          url,
          size,
          userId: currentUserId,
          folderId: folderId ? Number(folderId) : null,
        },
      });

      res.status(201).json({ status: "success", data: newFile });
    } catch (error) {
      next(error);
    }
  },
);

fileRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUserId = (req.user as any).id;
    const { folderId } = req.query;

    let whereClause: any = { userId: currentUserId };

    if (folderId === "root") {
      whereClause.folderId = null;
    } else if (folderId) {
      whereClause.folderId = Number(folderId);
    }

    const files = await prisma.file.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      status: "success",
      data: files,
    });
  } catch (error) {
    next(error);
  }
});

fileRouter.put(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, folderId } = req.body;
      const currentUserId = (req.user as any).id;

      const file = await prisma.file.findUnique({
        where: { id: Number(id) },
      });

      if (!file || file.userId !== currentUserId) {
        res.status(404).json({
          status: "fail",
          message: "File not found or user is unauthorised.",
        });
        return;
      }

      const updatedFile = await prisma.file.update({
        where: { id: Number(id) },
        data: {
          name,
          folderId:
            folderId !== undefined
              ? folderId
                ? Number(folderId)
                : null
              : file.folderId,
        },
      });

      res.status(200).json({
        status: "success",
        data: updatedFile,
      });
    } catch (error) {
      next(error);
    }
  },
);

fileRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const currentUserId = (req.user as any).id;

      const file = await prisma.file.findUnique({
        where: { id: Number(id) },
      });

      if (!file || file.userId !== currentUserId) {
        res.status(404).json({
          status: "fail",
          message: "File not found or user is unauthorised.",
        });
        return;
      }

      await prisma.file.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({
        status: "success",
        message: "File deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
);

export default fileRouter;
