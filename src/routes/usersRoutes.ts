import { Router } from "express";
import { UsersControllers } from "@/controllers/usersControllers";

const usersControllers = new UsersControllers()
export const usersRoutes = Router()

usersRoutes.post("/", usersControllers.create)
usersRoutes.get("/", usersControllers.index)
usersRoutes.get("/:id", usersControllers.indexByID)
usersRoutes.patch("/", usersControllers.update)
