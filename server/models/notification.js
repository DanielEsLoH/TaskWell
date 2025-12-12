import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "TASK_ASSIGNED",
        "TASK_UPDATED",
        "TASK_COMMENT",
        "PROJECT_INVITE",
        "WORKSPACE_INVITE",
      ],
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    relatedId: { type: Schema.Types.ObjectId }, // Can be Task ID, Project ID, etc.
    relatedType: { type: String, enum: ["Task", "Project", "Workspace"] },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
