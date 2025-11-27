import { Header } from "@/components/layout/header";
import { SidebarComponent } from "@/components/layout/sidebar-component";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { fetchData } from "@/lib/fetch-util";
import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/types";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLoaderData, useNavigate, useSearchParams } from "react-router";

export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([fetchData("/workspaces")]);
    return { workspaces };
  } catch (error) {
    console.log(error);
  }
}

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loaderData = useLoaderData() as { workspaces: Workspace[] } | undefined;
  const workspaces = loaderData?.workspaces || [];

  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
    null
  );

  // Select default workspace on mount
  useEffect(() => {
    const workspaceIdFromUrl = searchParams.get("workspaceId");

    if (workspaces.length > 0) {
      if (workspaceIdFromUrl) {
        // Find workspace from URL
        const workspace = workspaces.find((w) => w._id === workspaceIdFromUrl);
        if (workspace) {
          setCurrentWorkspace(workspace);
        } else {
          // Invalid workspace ID in URL, select first workspace
          const firstWorkspace = workspaces[0];
          setCurrentWorkspace(firstWorkspace);
          const currentPath = window.location.pathname;
          navigate(`${currentPath}?workspaceId=${firstWorkspace._id}`, {
            replace: true,
          });
        }
      } else {
        // No workspace in URL, select first workspace
        const lastWorkspaceId = localStorage.getItem("lastWorkspaceId");
        const lastWorkspace = workspaces.find((w) => w._id === lastWorkspaceId);
        const defaultWorkspace = lastWorkspace || workspaces[0];

        setCurrentWorkspace(defaultWorkspace);
        const currentPath = window.location.pathname;
        navigate(`${currentPath}?workspaceId=${defaultWorkspace._id}`, {
          replace: true,
        });
      }
    }
  }, [workspaces, searchParams, navigate]);

  // Update currentWorkspace when URL changes
  useEffect(() => {
    const workspaceIdFromUrl = searchParams.get("workspaceId");
    if (workspaceIdFromUrl && workspaces.length > 0) {
      const workspace = workspaces.find((w) => w._id === workspaceIdFromUrl);
      if (workspace && workspace._id !== currentWorkspace?._id) {
        setCurrentWorkspace(workspace);
      }
    }
  }, [searchParams, workspaces, currentWorkspace?._id]);

  // Persist selected workspace
  useEffect(() => {
    if (currentWorkspace) {
      localStorage.setItem("lastWorkspaceId", currentWorkspace._id);
    }
  }, [currentWorkspace]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  return (
    <div className="flex h-screen w-full">
      {/* <SidebarComponent /> */}
      <SidebarComponent currentWorkspace={currentWorkspace} />
      <div className="flex flex-1 flex-col h-full">
        {/* <HeaderComponent /> */}
        <Header
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />
        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <CreateWorkspace 
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;
