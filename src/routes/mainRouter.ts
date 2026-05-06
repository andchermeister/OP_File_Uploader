import { Router } from "express";
import { renderIndex } from "../controllers/mainController";
import passport from "passport";

const mainRouter = Router();

mainRouter.get("/", renderIndex);

export default mainRouter;
