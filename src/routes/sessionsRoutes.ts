import { Router } from "express";
import { SessionsController } from "@/controllers/sessionsController";

export const sessionsRoutes = Router();
const sessiosController = new SessionsController();

sessionsRoutes.post("/", sessiosController.create);
