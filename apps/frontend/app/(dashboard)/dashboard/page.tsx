"use client";

import React, { createContext, useEffect } from "react";

import { EmptyPlaceholder } from "../../../components/empty-placeholder";
import { DashboardHeader } from "../../../components/header";
import { DashboardShell } from "../../../components/shell";
import KanbanBoard from "../../../components/dashboard/kanban";
import { Button } from "../../../components/ui/button";
import { Columns } from "lucide-react";
import { ListChecks } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { createPortal } from "react-dom";
import { TabsPortalContent } from "../../../components/dashboard/tabs-content-portal";
import { store } from "../../../store/store";
import { TaskDialog } from "../../../components/tasks/create-task";

export default async function DashboardPage() {
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
            <TabsPortalContent />
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
