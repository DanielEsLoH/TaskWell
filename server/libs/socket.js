import { Server } from "socket.io";
import Notification from "../models/notification.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this for production security
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // console.log("New client connected", socket.id);

    // Join user to a private room based on their User ID
    socket.on("join", (userId) => {
      socket.join(userId);
      // console.log(`User ${userId} joined room`);
    });

    socket.on("disconnect", () => {
      // console.log("Client disconnected");
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const sendNotification = async ({
  recipients,
  sender,
  type,
  message,
  relatedId,
  relatedType,
}) => {
  if (!io) return;

  // Filter out the sender from recipients (don't notify yourself)
  const validRecipients = recipients.filter(
    (r) => r.toString() !== sender.toString()
  );

  for (const recipientId of validRecipients) {
    try {
      // 1. Save to DB
      const notification = await Notification.create({
        recipient: recipientId,
        sender,
        type,
        message,
        read: false,
        relatedId,
        relatedType,
      });

      const populatedNotification = await notification.populate(
        "sender",
        "name profilePicture"
      );

      // 2. Emit via Socket
      io.to(recipientId.toString()).emit(
        "newNotification",
        populatedNotification
      );
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
};
