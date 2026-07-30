import { Request, Response } from "express";
import { prisma } from "../../prisma/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { ensureIsAdmin } from "@/middlewares/ensureIsAdmin";

export class TeamsController {
  async create(request: Request, response: Response) {
    if (!ensureIsAdmin) {
      throw new AppError("You dont have permission for this");
    }

    const bodySchema = z.object({
      name: z.string().min(3).max(100),
      description: z.string().min(6).max(160),
    });

    const { name, description } = bodySchema.parse(request.body);

    const checkTeams = await prisma.teams.findFirst({ where: { name } });

    if (checkTeams) {
      throw new AppError("This team name already exist");
    }

    const createTeam = await prisma.teams.create({
      data: {
        name,
        description,
      },
    });

    return response.json({ createTeam });
  }

  async index(request: Request, response: Response) {
    const listTeams = await prisma.teams.findMany();

    return response.json(listTeams);
  }

  async update(request: Request, response: Response) {
    const bodySchema = z.object({
      id: z.uuid(),
      name: z.string().min(3).max(100),
      description: z.string().min(6).max(160).optional(),
    });

    const { id, name, description } = bodySchema.parse(request.body);

    const checkTeams = await prisma.teams.findFirst({ where: { name } });

    if (checkTeams && checkTeams.id != id) {
      throw new AppError("This team name already exist");
    }

    const updateTeam = await prisma.teams.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return response.json(updateTeam);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const checkID = await prisma.teams.findFirst({ where: { id } });

    if (!checkID) {
      throw new AppError("This team dont exist");
    }

    const deleteTeams = await prisma.teams.delete({ where: { id } });

    return response.status(200).json({ message: "Team deleted" });
  }

  async addMembers(request: Request, response: Response) {
    const bodySchema = z.object({
      userID: z.uuid(),
      teamID: z.uuid(),
    });

    const { userID, teamID } = bodySchema.parse(request.body);

    const checkMembers = await prisma.teamMembers.findFirst({
      where: { userID },
    });

    if (checkMembers) {
      throw new AppError("This user already belongs to a team.");
    }

    const addMember = await prisma.teamMembers.create({
      data: {
        userID,
        teamID,
      },
    });

    return response.json(addMember);
  }

  async listMembers(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamID: z.uuid(),
    });

    const { teamID } = paramsSchema.parse(request.params);

    const listMembers = await prisma.teamMembers.findMany({
      where: {
        teamID,
      },
      include: {
        users: {
          omit: {
            password: true,
            role: true,
            updateAt: true,
          },
        },
      },
    });

    const list = listMembers.map((item) => {
      return {
        user_id: item.users.id,
        name: item.users.name,
        email: item.users.email,
      };
    });

    return response.json(list);
  }

  async deleteMembers(request: Request, response: Response) {
    const paramsSchema = z.object({
      teamID: z.uuid(),
      userID: z.uuid(),
    });

    const { teamID, userID } = paramsSchema.parse(request.params);

    const checkID = await prisma.teamMembers.findFirst({ where: { userID } });

    if (!checkID) {
      throw new AppError("This member dont exist");
    }

    const deleteMember = await prisma.teamMembers.delete({
      where: {
        userID_teamID: {
          userID,
          teamID,
        },
      },
    });

    return response.json({ message: "Member deleted" });
  }
}
