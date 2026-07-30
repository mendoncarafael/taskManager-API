import { Router } from "express";
import { TeamsController } from "@/controllers/teamsController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { ensureIsAdmin } from "@/middlewares/ensureIsAdmin";

export const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.post("/",ensureAuthenticated, ensureIsAdmin, teamsController.create)
teamsRoutes.post("/members", ensureAuthenticated, ensureIsAdmin, teamsController.addMembers)
teamsRoutes.get("/:teamID/members", ensureAuthenticated, ensureIsAdmin, teamsController.listMembers)
teamsRoutes.delete("/:teamID/:userID/members", ensureAuthenticated, ensureIsAdmin, teamsController.deleteMembers)
teamsRoutes.get("/",ensureAuthenticated, ensureIsAdmin, teamsController.index)
teamsRoutes.patch("/",ensureAuthenticated, ensureIsAdmin, teamsController.update)
teamsRoutes.delete("/:id",ensureAuthenticated, ensureIsAdmin, teamsController.delete)