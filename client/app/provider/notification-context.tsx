import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth-context";
import { toast } from "sonner";
import { fetchData, updateData } from "@/lib/fetch-util";

interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  type: string;
  message: string;
  read: boolean;
  relatedId?: string;
  relatedType?: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  socket: Socket | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Initialize Socket.io
  useEffect(() => {
    if (!user) return;

    const socketInstance = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
        // Adjust path if necessary (e.g. if your socket is on a different path)
    });

    socketInstance.emit("join", user._id);

    socketInstance.on("connect", () => {
      console.log("Connected to notification socket");
    });

    socketInstance.on("newNotification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.info(notification.message, {
        description: `From ${notification.sender.name}`,
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  // Fetch initial notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const data = await fetchData<Notification[]>("/notifications");
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
        // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      await updateData(`/notifications/${id}/read`, {});
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
        // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      await updateData("/notifications/read-all", {});
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        socket,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
