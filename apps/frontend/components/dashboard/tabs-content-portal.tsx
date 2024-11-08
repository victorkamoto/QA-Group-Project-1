"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import KanbanBoard from "./kanban";
import { TabsContent } from "../ui/tabs";
import TaskItem from "../tasks/task-item";
import { Task } from "../../types/task.types";
import { store } from "../../store/store";
import { TaskItemSkeleton } from "../tasks/task-item-skeleton";

interface KanbanBoardProps {
  tasks: Task[];
}

export function TabsPortalContent({ tasks }: KanbanBoardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div>
      <TabsContent value="list">
        {!tasks ? (
          <>
            <TaskItemSkeleton />
            <TaskItemSkeleton />
            <TaskItemSkeleton />
          </>
        ) : (
          tasks.map((t) => <TaskItem task={t} key={t.xata_id} />)
        )}
      </TabsContent>
      <TabsContent value="kanban">
        <KanbanBoard tasks={tasks} />
      </TabsContent>
    </div>,
    document.getElementById("tabs-content-portal")!
  );
}
