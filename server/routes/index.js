import express from "express";
import userRoutes from "./user.js";
import authRoutes from "./auth.js";
import workspaceRoutes from "./workspace.js";
import projectRoutes from "./project.js";
import taskRoutes from "./task.js";
import notificationRoutes from "./notification.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/notifications", notificationRoutes);

export default router;
