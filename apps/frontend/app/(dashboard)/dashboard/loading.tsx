import React from "react";
import { DashboardHeader } from "../../../components/header";
import { DashboardShell } from "../../../components/shell";
import { TaskItemSkeleton } from "../../../components/tasks/task-item-skeleton";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-4">
          <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground w-[200px]">
            <Skeleton className="h-7 w-[180px]" />
          </div>
        </div>
        <Skeleton className="h-9 w-[120px]" />
      </div>

      <div className="grid gap-4 mt-4">
        <TaskItemSkeleton />
        <TaskItemSkeleton />
        <TaskItemSkeleton />
      </div>
    </DashboardShell>
  );
}
