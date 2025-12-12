import { Loader } from "@/components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteWorkspaceMutation,
  useGetWorkspaceDetailsQuery,
  useUpdateWorkspaceMutation,
} from "@/hooks/use-workspace";
import { getInitials } from "@/lib/utils";
import type { Workspace } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Building,
  Mail,
  Save,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

const Settings = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const queryResult = useGetWorkspaceDetailsQuery(workspaceId);
  const {
    data: workspace,
    isLoading,
    isError,
  } = queryResult as {
    data: Workspace | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  console.log("Settings component rendering", {
    workspaceId,
    workspace,
    isLoading,
    isError,
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const updateWorkspaceMutation = useUpdateWorkspaceMutation(workspaceId || "");
  const deleteWorkspaceMutation = useDeleteWorkspaceMutation(workspaceId || "");

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setDescription(workspace.description || "");
    }
  }, [workspace]);

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No workspace selected.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Failed to load workspace settings.</p>
      </div>
    );
  }

  const handleSaveGeneral = () => {
    if (!name.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    updateWorkspaceMutation.mutate(
      { name, description },
      {
        onSuccess: () => {
          toast.success("Workspace updated successfully");
          queryClient.invalidateQueries({
            queryKey: ["workspace", workspaceId],
          });
          queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      }
    );
  };

  const handleDeleteWorkspace = () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this workspace? This action cannot be undone."
      )
    ) {
      return;
    }

    deleteWorkspaceMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Workspace deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["workspaces"] });
        navigate("/workspaces");
      },
      onError: () => {
        toast.error("Failed to delete workspace");
      },
    });
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your workspace preferences and members.
        </p>
      </div>

      <Tabs
        defaultValue="general"
        className="w-full flex flex-col md:flex-row gap-6"
      >
        <aside className="w-full md:w-[250px] lg:w-[300px] shrink-0">
          <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1 justify-start">
            <TabsTrigger
              value="general"
              className="w-full justify-start px-4 py-2 h-10 data-[state=active]:bg-muted data-[state=active]:text-foreground font-normal hover:bg-muted/50 transition-colors rounded-md"
            >
              <Building className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="members"
              className="w-full justify-start px-4 py-2 h-10 data-[state=active]:bg-muted data-[state=active]:text-foreground font-normal hover:bg-muted/50 transition-colors rounded-md"
            >
              <Users className="mr-2 h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger
              value="danger"
              className="w-full justify-start px-4 py-2 h-10 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 text-red-600 hover:bg-red-50/50 transition-colors rounded-md font-normal"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Danger Zone
            </TabsTrigger>
          </TabsList>
        </aside>

        <div className="flex-1 space-y-6">
          {/* GENERAL TAB */}
          <TabsContent value="general" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                  Update your workspace's public information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Workspace Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A short description of your workspace."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-4">
                <Button
                  onClick={handleSaveGeneral}
                  className="ml-auto"
                  disabled={updateWorkspaceMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateWorkspaceMutation.isPending
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* MEMBERS TAB */}
          <TabsContent value="members" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>
                      Manage who has access to this workspace.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {workspace.members?.map((member) => {
                    if (!member.user) return null;
                    return (
                      <div
                        key={member.user._id}
                        className="flex items-center justify-between space-x-4"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={member.user.profilePicture} />
                            <AvatarFallback>
                              {getInitials(member.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-none">
                              {member.user.name}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <Mail className="mr-1 h-3 w-3" />
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="px-2 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize">
                            {member.role}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {!workspace.members?.length && (
                    <div className="text-center py-6 text-muted-foreground">
                      No members found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DANGER ZONE TAB */}
          <TabsContent value="danger" className="mt-0 space-y-6">
            <Card className="border-red-200">
              <CardHeader className="bg-red-50/50 rounded-t-xl">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <CardTitle>Danger Zone</CardTitle>
                </div>
                <CardDescription className="text-red-600/80">
                  Irreversible and destructive actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Delete Workspace</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this workspace and all its contents
                      (projects, tasks, members).
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteWorkspace}
                    disabled={deleteWorkspaceMutation.isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleteWorkspaceMutation.isPending
                      ? "Deleting..."
                      : "Delete Workspace"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;