import { Loader } from "@/components/loader";
import { ProjectCard } from "@/components/project/project-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetWorkspaceArchivedItemsQuery } from "@/hooks/use-workspace";
import type { Project, Task } from "@/types";
import { format } from "date-fns";
import { ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const ArchivedItems = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const { data, isLoading } = useGetWorkspaceArchivedItemsQuery(workspaceId) as {
    data: { tasks: Task[]; projects: Project[] };
    isLoading: boolean;
  };

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No workspace selected.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const { tasks = [], projects = [] } = data || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Archived Items</h1>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Archived Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="projects">Archived Projects ({projects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Archived Tasks</CardTitle>
              <CardDescription>
                Tasks that have been archived in this workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <div className="divide-y">
                  {tasks.map((task) => (
                    <div key={task._id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-3">
                        <div className="flex">
                          <div className="flex gap-2 mr-2 mt-1">
                            {task.status === "Done" ? (
                              <CheckCircle className="size-4 text-green-500" />
                            ) : (
                              <Clock className="size-4 text-yellow-500" />
                            )}
                          </div>

                          <div>
                            <Link
                              to={`/workspaces/${workspaceId}/projects/${task.project._id}/tasks/${task._id}`}
                              className="font-medium hover:text-primary hover:underline transition-colors flex items-center"
                            >
                              {task.title}
                              <ArrowUpRight className="size-4 ml-1" />
                            </Link>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge
                                variant={
                                  task.status === "Done" ? "default" : "outline"
                                }
                              >
                                {task.status}
                              </Badge>

                              {task.priority && (
                                <Badge
                                  variant={
                                    task.priority === "High"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {task.priority}
                                </Badge>
                              )}
                              
                              <Badge variant="outline">Archived</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground space-y-1">
                          {task.dueDate && (
                            <div>Due: {format(new Date(task.dueDate), "PPPP")}</div>
                          )}

                          <div>
                            Project:{" "}
                            <span className="font-medium">
                              {task.project.title}
                            </span>
                          </div>

                          <div>
                            Archived on:{" "}
                            {format(new Date(task.updatedAt), "PPPP")}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted/50 p-4 mb-4">
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No archived tasks</h3>
                  <p className="text-muted-foreground max-w-sm mt-1">
                    There are no archived tasks in this workspace.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  progress={project.progress || 0}
                  workspaceId={workspaceId}
                />
              ))}
            </div>
          ) : (
             <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted/50 p-4 mb-4">
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No archived projects</h3>
                  <p className="text-muted-foreground max-w-sm mt-1">
                    There are no archived projects in this workspace.
                  </p>
                </CardContent>
             </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArchivedItems;
