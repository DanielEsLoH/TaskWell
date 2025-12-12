import Notice from "../models/notification.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import { sendNotification } from "../libs/socket.js";

const createTask = async (req, res) => {
  try {
    const { title, description, project, priority, dueDate, assignees } =
      req.body;

    const task = await Task.create({
      title,
      description,
      project,
      priority,
      dueDate,
      assignees,
      createdBy: req.user._id,
    });

    const projectData = await Project.findById(project);
    projectData.tasks.push(task._id);
    await projectData.save();

    // Send notifications to assignees
    if (assignees && assignees.length > 0) {
      await sendNotification({
        recipients: assignees,
        sender: req.user._id,
        type: "TASK_ASSIGNED",
        message: `You have been assigned to task: ${title}`,
        relatedId: task._id,
        relatedType: "Task",
      });
    }

    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const duplicateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    const newTask = await Task.create({
      ...task.toObject(),
      _id: undefined,
      title: `${task.title} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined,
      createdBy: req.user._id,
    });

    newTask.subTasks = task.subTasks.map((subTask) => ({
      ...subTask.toObject(),
      _id: undefined,
      completed: false,
      createdAt: undefined,
    }));

    await newTask.save();

    // Add task to project
    await Project.findByIdAndUpdate(task.project, {
      $push: { tasks: newTask._id },
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, priority, dueDate, status, assignees } =
      req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        priority,
        dueDate,
        status,
        assignees,
      },
      { new: true }
    );

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { assignees: { $in: [req.user._id] } },
        { createdBy: req.user._id },
        { watchers: { $in: [req.user._id] } },
      ],
      isArchived: false,
    })
      .populate("project", "title")
      .populate("assignees", "name email profilePicture")
      .populate("comments.user", "name email profilePicture")
      .sort({ updatedAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId)
      .populate("project", "title")
      .populate("assignees", "name email profilePicture")
      .populate("subTasks")
      .populate("watchers", "name email profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name email profilePicture",
        },
      });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createSubTask = async (req, res) => {
  try {
    const { title, date, tag } = req.body;
    const { taskId } = req.params;

    const newSubTask = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(taskId);

    task.subTasks.push(newSubTask);

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTaskStage = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId);

    task.status = status;

    await task.save();

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const achievedTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    task.isArchived = !task.isArchived;

    await task.save();

    res.status(200).json({ message: "Task achieved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRestoreTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(taskId);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isArchived: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(taskId);

      resp.isArchived = false;

      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isArchived: true },
        { $set: { isArchived: false } }
      );
    }

    res.status(200).json({ message: "Operation performed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignees: { $in: [req.user._id] },
    })
      .populate("project", "title workspace")
      .populate("assignees", "name email profilePicture")
      .sort({ updatedAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTaskAssignees = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignees } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignees },
      { new: true }
    );
    
    // Notify newly assigned users
    if (assignees && assignees.length > 0) {
      await sendNotification({
        recipients: assignees,
        sender: req.user._id,
        type: "TASK_ASSIGNED",
        message: `You have been assigned to task: ${task.title}`,
        relatedId: task._id,
        relatedType: "Task",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTaskPriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { priority } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { priority },
      { new: true }
    );

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        $push: {
          comments: {
            text,
            user: req.user._id,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("comments.user", "name email profilePicture");

    // Notify assignees and watchers
    // Filter out unique recipients
    const recipients = [...new Set([...task.assignees, ...(task.watchers || [])])];
    
    if (recipients.length > 0) {
      await sendNotification({
        recipients,
        sender: req.user._id,
        type: "TASK_COMMENT",
        message: `New comment on task: ${task.title}`,
        relatedId: task._id,
        relatedType: "Task",
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  achievedTask,
  createSubTask,
  createTask,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  updateTask,
  updateTaskStage,
  getMyTasks,
  updateTaskAssignees,
  updateTaskPriority,
  updateTaskStatus,
  addComment,
};