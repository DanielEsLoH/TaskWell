import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";

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
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json(workspace);
  } catch (error) {}
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

export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
};
