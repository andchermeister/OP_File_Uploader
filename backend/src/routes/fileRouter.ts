import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { isAuthenticated } from "../middleware/authGuard";
import { upload } from "../middleware/uploadEngine";

const fileRouter = Router();
fileRouter.use(isAuthenticated);

fileRouter.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res
          .status(400)
          .json({ status: "fail", message: "No file asset provided." });
        return;
      }

      const currentUserId = (req.user as any).id;
      const folderId = req.body;

      let parsedFolderId: number | null = null;

      if (
        folderId &&
        typeof folderId === "string" &&
        folderId !== "undefined" &&
        folderId !== "[object Object]"
      ) {
        parsedFolderId = Number(folderId);
      }

      const newFile = await prisma.file.create({
        data: {
          name: req.file.originalname,
          url: req.file.path,
          size: req.file.size,
          userId: currentUserId,
          folderId: parsedFolderId,
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
