import { Router } from "express";
import { usersRoutes } from "./usersRoutes";
import { sessionsRoutes } from "./sessionsRoutes";
import { teamsRoutes } from "./teamsRoutes";
import { tasksRoutes } from "./tasksRoutes";
import { tasksHistoryRoutes } from "./tasksHistoryRoutes";

export const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/teams", teamsRoutes);
routes.use("/tasks", tasksRoutes);
routes.use("/tasksHistory", tasksHistoryRoutes);
