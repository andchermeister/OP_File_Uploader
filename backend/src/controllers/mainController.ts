import { Request, Response } from "express";

export async function renderIndex(req: Request, res: Response) {
  res.render("index");
}
