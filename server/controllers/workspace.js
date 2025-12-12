import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Invitation from "../models/invitation.js";
import User from "../models/user.js";
import crypto from "crypto";
import { sendEmail } from "../libs/send-email.js";
import { workspaceInvitationTemplate } from "../libs/email-templates.js";
import { sendNotification } from "../libs/socket.js";

const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(workspaces);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId).populate(
      "members.user",
      "name email profilePicture"
    );
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
      // members: { $in: [req.user._id] },
    })
      // .populate("tasks", "status")
      .sort({ createdAt: -1 });

    res.status(200).json({ projects, workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Verify workspace access
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Get all projects in workspace
    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
    }).populate("tasks");

    // Get all tasks in workspace projects
    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({
      project: { $in: projectIds },
      isArchived: false,
    }).populate("assignees", "name email profilePicture");

    // Calculate basic stats
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const totalProjectInProgress = projects.filter(
      (p) => p.status === "In Progress"
    ).length;
    const totalTaskCompleted = tasks.filter(
      (t) => t.status === "Done"
    ).length;
    const totalTaskToDo = tasks.filter((t) => t.status === "To Do").length;
    const totalTaskInProgress = tasks.filter(
      (t) => t.status === "In Progress"
    ).length;

    // Generate task trends data (last 7 days)
    const taskTrendsData = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayTasks = tasks.filter(
        (t) =>
          new Date(t.createdAt) >= dayStart && new Date(t.createdAt) <= dayEnd
      );

      taskTrendsData.push({
        name: dayName,
        completed: dayTasks.filter((t) => t.status === "Done").length,
        inProgress: dayTasks.filter((t) => t.status === "In Progress").length,
        todo: dayTasks.filter((t) => t.status === "To Do").length,
      });
    }

    // Generate project status data
    const projectStatusMap = {};
    const statusColors = {
      Planning: "#8B5CF6",
      "In Progress": "#3B82F6",
      "On Hold": "#F59E0B",
      Completed: "#10B981",
      Cancelled: "#EF4444",
    };

    projects.forEach((p) => {
      if (!projectStatusMap[p.status]) {
        projectStatusMap[p.status] = 0;
      }
      projectStatusMap[p.status]++;
    });

    const projectStatusData = Object.entries(projectStatusMap).map(
      ([name, value]) => ({
        name,
        value,
        color: statusColors[name] || "#6B7280",
      })
    );

    // Generate task priority data
    const priorityMap = {};
    const priorityColors = {
      High: "#EF4444",
      Medium: "#F59E0B",
      Low: "#10B981",
    };

    tasks.forEach((t) => {
      if (!priorityMap[t.priority]) {
        priorityMap[t.priority] = 0;
      }
      priorityMap[t.priority]++;
    });

    const taskPriorityData = Object.entries(priorityMap).map(
      ([name, value]) => ({
        name,
        value,
        color: priorityColors[name] || "#6B7280",
      })
    );

    // Generate workspace productivity data (projects with their completion rates)
    const workspaceProductivityData = projects.slice(0, 5).map((project) => {
      const projectTasks = tasks.filter(
        (t) => t.project.toString() === project._id.toString()
      );
      const completedTasks = projectTasks.filter(
        (t) => t.status === "Done"
      ).length;

      return {
        name: project.title.length > 15
          ? project.title.substring(0, 15) + "..."
          : project.title,
        completed: completedTasks,
        total: projectTasks.length,
      };
    });

    // Get upcoming tasks (next 7 days, sorted by due date)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    const upcomingTasks = await Task.find({
      project: { $in: projectIds },
      isArchived: false,
      dueDate: { $gte: now, $lte: sevenDaysFromNow },
      status: { $ne: "Done" },
    })
      .populate("assignees", "name email profilePicture")
      .populate("project", "title")
      .sort({ dueDate: 1 })
      .limit(10);

    // Get recent projects (last 5 created)
    const recentProjects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
    })
      .populate("tasks", "status")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      stats: {
        totalProjects,
        totalTasks,
        totalProjectInProgress,
        totalTaskCompleted,
        totalTaskToDo,
        totalTaskInProgress,
      },
      taskTrendsData,
      projectStatusData,
      taskPriorityData,
      workspaceProductivityData,
      upcomingTasks,
      recentProjects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const inviteUserToWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    // Verify workspace exists and user has permission
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "email");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user has permission to invite (must be owner or admin)
    const memberRole = workspace.members.find(
      (m) => m.user._id.toString() === req.user._id.toString()
    )?.role;

    if (!["owner", "admin"].includes(memberRole)) {
      return res
        .status(403)
        .json({ message: "You don't have permission to invite members" });
    }

    // Check if user is already a member
    const isAlreadyMember = workspace.members.some(
      (m) => m.user.email === email
    );

    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this workspace" });
    }

    // Check if there's already a pending invitation
    const existingInvitation = await Invitation.findOne({
      workspace: workspaceId,
      email,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (existingInvitation) {
      return res.status(400).json({
        message: "An invitation has already been sent to this email",
      });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString("hex");

    // Create invitation (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await Invitation.create({
      workspace: workspaceId,
      invitedBy: req.user._id,
      email,
      role: role || "member",
      token,
      expiresAt,
    });

    // Send email with invitation link
    const invitationLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspaceId}?tk=${token}`;
    const emailContent = workspaceInvitationTemplate(
      workspace.name,
      invitationLink,
      req.user.name
    );

    await sendEmail(
      email,
      `Invitation to join ${workspace.name} - TaskWell`,
      emailContent
    );

    // Notify user if they already exist
    const invitedUser = await User.findOne({ email });
    if (invitedUser) {
      await sendNotification({
        recipients: [invitedUser._id],
        sender: req.user._id,
        type: "WORKSPACE_INVITE",
        message: `You have been invited to join workspace: ${workspace.name}`,
        relatedId: workspace._id,
        relatedType: "Workspace",
      });
    }

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation: {
        _id: invitation._id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const acceptInviteByToken = async (req, res) => {
  try {
    const { token } = req.body;

    // Find invitation
    const invitation = await Invitation.findOne({
      token,
      status: "pending",
    }).populate("workspace", "name description color");

    if (!invitation) {
      return res
        .status(404)
        .json({ message: "Invitation not found or already used" });
    }

    // Check if invitation is expired
    if (invitation.expiresAt < new Date()) {
      invitation.status = "expired";
      await invitation.save();
      return res.status(400).json({ message: "Invitation has expired" });
    }

    // Check if invitation email matches logged-in user
    if (invitation.email !== req.user.email) {
      return res.status(403).json({
        message: "This invitation was sent to a different email address",
      });
    }

    // Add user to workspace
    const workspace = await Workspace.findById(invitation.workspace._id);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if already a member
    const isAlreadyMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isAlreadyMember) {
      workspace.members.push({
        user: req.user._id,
        role: invitation.role,
        joinedAt: new Date(),
      });
      await workspace.save();
    }

    // Update invitation status
    invitation.status = "accepted";
    await invitation.save();

    res.status(200).json({
      message: "Successfully joined workspace",
      workspace: {
        _id: workspace._id,
        name: workspace.name,
        description: workspace.description,
        color: workspace.color,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const acceptGenerateInvite = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // Find workspace
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user is already a member
    const isAlreadyMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ message: "You are already a member of this workspace" });
    }

    // Add user to workspace with default member role
    workspace.members.push({
      user: req.user._id,
      role: "member",
      joinedAt: new Date(),
    });
    await workspace.save();

    res.status(200).json({
      message: "Successfully joined workspace",
      workspace: {
        _id: workspace._id,
        name: workspace.name,
        description: workspace.description,
        color: workspace.color,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkspaceArchivedItems = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Get all projects to filter tasks
    const allProjects = await Project.find({ workspace: workspaceId }).select(
      "_id"
    );
    const allProjectIds = allProjects.map((p) => p._id);

    // Get archived projects
    const archivedProjects = await Project.find({
      workspace: workspaceId,
      isArchived: true,
    })
      .populate("tasks")
      .populate("members.user", "name email profilePicture")
      .sort({ updatedAt: -1 });

    // Get archived tasks
    const archivedTasks = await Task.find({
      project: { $in: allProjectIds },
      isArchived: true,
    })
      .populate("project", "title")
      .populate("assignees", "name email profilePicture")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      projects: archivedProjects,
      tasks: archivedTasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description } = req.body;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const member = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!["owner", "admin"].includes(member.role)) {
      return res
        .status(403)
        .json({ message: "You don't have permission to update this workspace" });
    }

    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;

    await workspace.save();

    res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      owner: req.user._id,
    });

    if (!workspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or you are not the owner" });
    }

    // Delete all projects in the workspace
    const projects = await Project.find({ workspace: workspaceId });
    const projectIds = projects.map((p) => p._id);

    // Delete all tasks in those projects
    await Task.deleteMany({ project: { $in: projectIds } });

    // Delete all projects
    await Project.deleteMany({ workspace: workspaceId });

    // Delete the workspace
    await Workspace.findByIdAndDelete(workspaceId);

    res.status(200).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
  inviteUserToWorkspace,
  acceptInviteByToken,
  acceptGenerateInvite,
  getWorkspaceArchivedItems,
  updateWorkspace,
  deleteWorkspace,
};
