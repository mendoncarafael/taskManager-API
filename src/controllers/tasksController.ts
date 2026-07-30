import { Request, Response } from "express";
import { prisma } from "../../prisma/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

export class TasksController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      title: z.string().min(3).max(100),
      description: z.string().min(3).max(200),
      priority: z.enum(["high", "medium", "low"]),
      assignedTo: z.uuid().nullable().default(null),
      teamID: z.uuid(),
    });

    const { title, description, priority, assignedTo, teamID } =
      bodySchema.parse(request.body);

    const tasks = await prisma.tasks.create({
      data: {
        title,
        description,
        priority,
        assignedTo,
        teamID,
      },
    });

    return response.json(tasks);
  }

  async index(request: Request, response: Response) {
    if (!request.user) {
      throw new AppError("User not found");
    }

    const userID = request.user.id;

    if (request.user.role === "member") {
      const listTasks = await prisma.tasks.findMany({
        where: { assignedTo: userID },
      });

      return response.json(listTasks);
    }

    const listTasks = await prisma.tasks.findMany();

    return response.json(listTasks);
  }

  async attributedTo(request: Request, response: Response) {
    const paramsSchema = z.object({
      userID: z.uuid().nullable().default(null),
    });

    const { userID } = paramsSchema.parse(request.params);

    const assigned = await prisma.tasks.findMany({
      where: {
        assignedTo: userID,
      },
      omit: {
        id: true,
        assignedTo: true,
        teamID: true,
      },
    });

    return response.json(assigned);
  }

  async update(request: Request, response: Response) {
    const bodySchema = z.object({
      id: z.uuid(),
      title: z.string().min(3).max(100),
      description: z.string().min(3).max(200).optional(),
      priority: z.enum(["high", "medium", "low"]),
      assignedTo: z.uuid().nullable().default(null),
      teamID: z.uuid(),
    });

    const { id, title, description, priority, assignedTo, teamID } =
      bodySchema.parse(request.body);

    const checkTask = await prisma.tasks.findUnique({ where: { id } });

    if (!checkTask) {
      throw new AppError("This task dont exist");
    }

    const updateTask = await prisma.tasks.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        priority,
        assignedTo,
        teamID,
      },
    });

    return response.json(updateTask);
  }

  async assignTo(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
      userID: z.uuid().nullable().default(null),
    });

    const { id, userID } = paramsSchema.parse(request.params);

    const checkTask = await prisma.tasks.findUnique({ where: { id } });

    if (checkTask?.assignedTo) {
      throw new AppError("This task is already assigned.");
    }

    const assignTo = await prisma.tasks.update({
      where: { id },
      data: { assignedTo: userID },
    });

    return response.json(assignTo);
  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const deleteTask = await prisma.tasks.delete({ where: { id } });

    return response.json({ message: "Task Deleted" });
  }

  async filterStatus(request: Request, response: Response) {
    const querySchema = z.object({
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
    });

    const where: any = {};

    const { status, priority } = querySchema.parse(request.query);

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    const listFilters = await prisma.tasks.findMany({ where });

    return response.json(listFilters);
  }

  async filterPriority(request: Request, response: Response) {
    const querySchema = z.object({
      priority: z.enum(["high", "medium", "low"]),
    });

    const { priority } = querySchema.parse(request.query);

    const listFilters = await prisma.tasks.findMany({ where: { priority } });

    return response.json(listFilters);
  }
}
