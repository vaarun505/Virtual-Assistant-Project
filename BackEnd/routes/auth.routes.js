import express from "express";
import { LogIn, logOut, signUP } from "../controllers/Auth.controllers.js";

const authRouter = express.Router()

authRouter.post("/signup",signUP)
authRouter.post("/signin",LogIn)
authRouter.get("/logout",logOut)

export default authRouter