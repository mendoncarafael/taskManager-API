import { Router } from "express";
import { TaskHistoryController } from "@/controllers/taskHistoryController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";

export const tasksHistoryRoutes = Router();
const taskHistoryController = new TaskHistoryController();

tasksHistoryRoutes.patch(
  "/",
  ensureAuthenticated,
  taskHistoryController.updateStatus,
);

tasksHistoryRoutes.get("/", ensureAuthenticated, taskHistoryController.index);
