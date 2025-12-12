import express from "express";
import Notification from "../models/notification.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

// Get all notifications for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name email profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Mark a single notification as read
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Mark all notifications as read
router.put("/read-all", authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
