import { Request, Response } from "express";
import { z } from "zod"
import { hash } from "bcrypt";
import { prisma } from "../../prisma/database/prisma";
import { AppError } from "@/utils/AppError";


export class UsersControllers {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            name: z.string().trim().min(2).max(100),
            email: z.string().email().trim().min(4).max(150),
            password: z.string().min(2)
        })

        const {name, email, password} = bodySchema.parse(request.body)
      
        const checkEmail = await prisma.users.findUnique({where: {email}})
        
        if (checkEmail) {
            throw new AppError("This email already registered")
        }
        
        const hashedPassword = await hash(password, 8);

        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        const { password: _, ...userWithoutPassword } = user;

        return response.status(201).json(userWithoutPassword)
    }

    async index(request: Request, response: Response) {
        const users = await prisma.users.findMany({
            omit: {
                password: true
            }
        })

        return response.status(200).json(users)
    }

    async indexByID(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const {id} = paramsSchema.parse(request.params)

        const users = await prisma.users.findMany({
            omit: {
                password: true
            },
            where: {
                id
            }
        })

        return response.status(200).json(users)
    }

    async update(request: Request, response: Response) {
        const bodySchema = z.object({
            id: z.string().uuid(),
            name: z.string().trim().max(100).min(3),
            email: z.string().email().trim().min(4).max(150).optional()
        })

        const {id, name, email } = bodySchema.parse(request.body)

        const checkEmail = await prisma.users.findFirst({where: {email}})

        if(checkEmail) {
            throw new AppError("This email already registered")
        }

        const updateUser = await prisma.users.update({
            where: {
                id
            },
            data: {
                name, 
                email
            }
        })
        return response.status(200).json({updateUser})
    }
}