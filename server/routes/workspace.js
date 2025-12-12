import express from "express";
import { validateRequest } from "zod-express-middleware";
import { workspaceSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import {
  createWorkspace,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
  acceptInviteByToken,
  acceptGenerateInvite,
  getWorkspaceArchivedItems,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/workspace.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.put("/:workspaceId", authMiddleware, updateWorkspace);
router.delete("/:workspaceId", authMiddleware, deleteWorkspace);

router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);
router.get("/:workspaceId/archived", authMiddleware, getWorkspaceArchivedItems);

// Invitation routes
router.post("/:workspaceId/invite-member", authMiddleware, inviteUserToWorkspace);
router.post("/accept-invite-token", authMiddleware, acceptInviteByToken);
router.post("/:workspaceId/accept-generate-invite", authMiddleware, acceptGenerateInvite);

export default router;
