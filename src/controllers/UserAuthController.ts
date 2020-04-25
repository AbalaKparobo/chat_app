import { Request, Response } from "express";
import { Controller, Middleware, Get, Put, Post, Delete } from "@overnightjs/core";
import { Logger } from "@overnightjs/logger";

@Controller('api')
export class UserAuthController {
    
    @Get(':msg')
    private getMessage(req: Request, res: Response) {
        Logger.Info(req.params.msg);
        res.status(200).json({
            message: req.params.msg,
        });
    }
}