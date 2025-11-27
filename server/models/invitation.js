import mongoose, { Schema } from "mongoose";

const invitationSchema = new Schema(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "expired"],
      default: "pending",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster lookups
invitationSchema.index({ token: 1 });
invitationSchema.index({ workspace: 1, email: 1 });

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;
