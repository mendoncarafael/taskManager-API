import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { compare } from "bcrypt";
import { prisma } from "../../prisma/database/prisma";
import { AppError } from "@/utils/AppError";
import { sign } from "jsonwebtoken";
import { authConfig } from "@/configs/auth";

export class SessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      email: z.string().email().min(6),
      password: z.string().min(3),
    });

    const { email, password } = bodySchema.parse(request.body);

    const findUser = await prisma.users.findUnique({
      where: { email },
    });

    if (!findUser) {
      throw new AppError("Invalid login credentials");
    }

    const isValid = await compare(password, findUser.password);

    if (isValid === false) {
      throw new AppError("Invalid login credentials");
    }

    const sessionToken = sign(
      {
        role: findUser.role,
        sub: findUser.id,
      },

      authConfig.jwt.secret,

      {
        expiresIn: "1d",
      },
    );

    return response.status(200).json({ sessionToken });
  }
}
