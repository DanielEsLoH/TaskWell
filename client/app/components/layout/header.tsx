import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/provider/auth-context";
import { useNotifications } from "@/provider/notification-context";
import type { Workspace } from "@/types";
import { Bell, Plus, User } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
  onCreateWorkspace: () => void;
}

export const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}: HeaderProps) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        {/* Workspace Selector can go here if needed, or keeping existing structure */}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-600" />
              )}
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[380px] p-0">
            <div className="flex items-center justify-between border-b p-4">
              <h4 className="font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 text-xs"
                  onClick={() => markAllAsRead()}
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <ScrollArea className="h-[400px]">
              {notifications.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center text-muted-foreground">
                  <Bell className="mb-2 size-8 opacity-20" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="grid">
                  {notifications.map((notification) => (
                    <button
                      key={notification._id}
                      className={`flex items-start gap-3 border-b p-4 text-left transition-colors hover:bg-muted/50 ${
                        !notification.read ? "bg-muted/20" : ""
                      }`}
                      onClick={() => markAsRead(notification._id)}
                    >
                      <Avatar className="mt-0.5 size-8">
                        <AvatarImage
                          src={notification.sender.profilePicture}
                          alt={notification.sender.name}
                        />
                        <AvatarFallback>
                          {getInitials(notification.sender.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p
                          className={`text-sm ${
                            !notification.read ? "font-medium" : ""
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="size-8">
                <AvatarImage src={user?.profilePicture} alt={user?.name} />
                <AvatarFallback>{getInitials(user?.name || "")}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/user/profile" className="cursor-pointer">
                <User className="mr-2 size-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCreateWorkspace}>
              <Plus className="mr-2 size-4" />
              New Workspace
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};