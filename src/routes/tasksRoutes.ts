import { Router } from "express";
import { TasksController } from "@/controllers/tasksController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";

export const tasksRoutes = Router();
const tasksController = new TasksController();

tasksRoutes.post("/", tasksController.create);
tasksRoutes.get("/filter", tasksController.filterStatus);
tasksRoutes.get("/filter", tasksController.filterPriority);
tasksRoutes.get("/", ensureAuthenticated, tasksController.index);
tasksRoutes.get("/:userID", tasksController.attributedTo);
tasksRoutes.patch("/:id/:userID/task", tasksController.assignTo);
tasksRoutes.patch("/", tasksController.update);
tasksRoutes.delete("/:id", tasksController.delete);
