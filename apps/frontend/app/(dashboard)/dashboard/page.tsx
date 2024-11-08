"use client";

import React, { createContext, useEffect } from "react";
import { DashboardShell } from "../../../components/shell";
import { Columns } from "lucide-react";
import { ListChecks } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { TabsPortalContent } from "../../../components/dashboard/tabs-content-portal";
import { store } from "../../../store/store";
import { TaskDialog } from "../../../components/tasks/create-task";
import { useAuth } from "../../../components/auth/auth-provider";
import { Team } from "../../../types/team.types";

export default function DashboardPage() {
  const { user } = useAuth();
  const getTeams = store((state) => state.getTeamsByUserId);
  const getProjects = store((state) => state.getProjectsByTeamId);
  const getTasks = store((state) => state.getTasksByProjectId);
  const tasks = store((state) => state.tasks);

  useEffect(() => {
    const fetchAll = async () => {
      if (!user?.xata_id) return;

      await getTeams(user?.xata_id as string).then(async ({ data }) => {
        if (data) {
          const projectPromises = data.map((team: Team) =>
            getProjects(team.xata_id as string)
          );
          const projectResults = await Promise.all(projectPromises);
          const projects = projectResults
            .filter((res) => res.data)
            .flatMap((res) => res.data);
          store.setState({ projects });
          const taskPromises = projects.map((project: any) =>
            getTasks(project.xata_id as string)
          );
          const taskResults = await Promise.all(taskPromises);
          const tasks = taskResults
            .filter((res) => res.data)
            .flatMap((res) => res.data);
          store.setState({ tasks });
        }
      });
    };

    fetchAll();
  }, [user, getTeams, getProjects, getTasks]);
  return (
    <DashboardShell>
      <div className="flex items-center justify-between px-2">
        <div className="grid">
          <Tabs defaultValue="list" className="mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger
                value="list"
                className="flex items-center justify-center"
              >
                <ListChecks className="w-4 h-4 mr-2" />
                List
              </TabsTrigger>
              <TabsTrigger
                value="kanban"
                className="flex items-center justify-center"
              >
                <Columns className="w-4 h-4 mr-2" />
                Kanban
              </TabsTrigger>
            </TabsList>
            <TabsPortalContent tasks={tasks} />
          </Tabs>
        </div>
        <TaskDialog buttonText="Create Task" />
      </div>
      <div id="tabs-content-portal"></div>
    </DashboardShell>
  );
  // return (
  //   <DashboardShell>
  //     <>
  //       <EmptyPlaceholder>
  //         {/* <EmptyPlaceholder.Icon name="empty" /> */}
  //         <EmptyPlaceholder.Title>Nothing to see yet</EmptyPlaceholder.Title>
  //         <EmptyPlaceholder.Description>
  //           You don&apos;t have anything here yet.
  //         </EmptyPlaceholder.Description>
  //       </EmptyPlaceholder>
  //     </>
  //   </DashboardShell>
  // );
}
