import express from "express";
import { askToAssistant, getCurrentUser } from "../controllers/User.controller.js";
import IsAuth from "../middlewares/IsAuth.js"
import upload from "../middlewares/Multer.js"
import { updateAssistant } from "../controllers/User.controller.js";

const userRouter = express.Router()

userRouter.get("/current", IsAuth, getCurrentUser)
userRouter.post("/update", IsAuth, upload.single("assistantImage"), updateAssistant)
userRouter.post("/asktoassistant", IsAuth, askToAssistant)

export default userRouter 