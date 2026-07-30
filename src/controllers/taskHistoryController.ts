import { Request, Response } from "express";
import { prisma } from "../../prisma/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

export class TaskHistoryController {
  async updateStatus(request: Request, response: Response) {
    const bodySchema = z.object({
      id: z.uuid(),
      status: z.enum(["pending", "in_progress", "completed"]),
    });

    const { id, status } = bodySchema.parse(request.body);

    if (!request.user) {
      throw new AppError("User not found");
    }

    const userID = request.user.id;
    const takeStatus = await prisma.tasks.findUnique({ where: { id } });

    if (!takeStatus) {
      throw new AppError("Dont exist this task");
    }

    const oldStatus = takeStatus.status;

    const [changeStatus] = await prisma.$transaction([
      prisma.tasks.update({
        where: { id },
        data: { status },
        omit: {
          createdAt: true,
          id: true,
          assignedTo: true,
          teamID: true,
        },
      }),
      prisma.tasksHistory.create({
        data: {
          oldStatus,
          newStatus: status,
          taskID: id,
          changedBY: userID,
        },
      }),
    ]);

    return response.json({
      changeStatus,
      message: `Status changed to ${changeStatus.status}`,
    });
  }

  async index(request: Request, response: Response) {
    const ListHistory = await prisma.tasksHistory.findMany();

    return response.json(ListHistory);
  }
}
