import { Request, Response } from "express";
import { prisma } from "../../prisma/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

export class TaskHistoryController {
  async updateStatus(request: Request, response: Response) {
    const bodySchema = z.object({
      status: z.enum(["pending", "in_progress", "completed"]),
    });
  }
}
