// Step 4: Protect routes with middleware 
import { Request, Response, NextFunction } from "express";
import { app } from "../app";


export function requireLogin(req: Request, res: Response, next:
NextFunction) {
if (!req.session.userId) return res.redirect("/?q=need-login");
next();
}

app.get("/todos", requireLogin, (req: Request, res: Response) => {});
app.post("/add", requireLogin, (req: Request, res: Response) => {});
app.post("/delete", requireLogin, (req: Request, res: Response) => {});