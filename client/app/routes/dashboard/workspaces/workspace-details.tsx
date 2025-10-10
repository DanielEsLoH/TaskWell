import { Loader } from "@/components/loader";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";
import type { Project, Workspace } from "@/types";
import { useState } from "react";
import { useParams } from "react-router";
import { WorkspaceHeader } from "./workspace-header";
import { ProjectList } from "@/components/workspace/project-list";
import { CreateProjectDialog } from "@/components/project/create-project";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIscreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);

  if (!workspaceId) {
    return <div>No workspace found</div>;
  }

  const { data, isLoading } = useGetWorkspaceQuery(workspaceId) as {
    data: {
      workspace: Workspace;
      projects: Project[];
    };
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <WorkspaceHeader 
        workspace={data.workspace}
        members={data?.workspace?.members as any}
        onCreateProject={() => setIscreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />
      <ProjectList
        workspaceId={workspaceId}
        projects={data.projects}
        onCreateProject={() => setIscreateProject(true)}
      />
      <CreateProjectDialog
        isOpen={isCreateProject}
        onOpenChange={setIscreateProject}
        workspaceId={workspaceId}
        workspaceMembers={data.workspace.members as any}
      />
    </div>
  );
};

export default WorkspaceDetails;
