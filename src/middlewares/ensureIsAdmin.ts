import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";


export function ensureIsAdmin(
  request: Request,
  response: Response,
  next: NextFunction,
) {
 
     if (request.user?.role != "admin") {
            throw new AppError("You dont have permission for this",403)
     }

    return next();
}
