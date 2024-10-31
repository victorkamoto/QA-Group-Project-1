"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import KanbanBoard from "./kanban";
import { TabsContent } from "../ui/tabs";
import TaskItem from "../tasks/task-item";
import { Task } from "../../types/task.types";
import { store } from "../../store/store";
import { TaskItemSkeleton } from "../tasks/task-item-skeleton";

export function TabsPortalContent() {
  const [mounted, setMounted] = useState(false);
  const tasks = store((state) => state.tasks);
  const getTasks = store((state) => state.getTasks);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchTasks = async () => {
      await getTasks();
      setIsLoading(false);
    };

    fetchTasks();
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div>
      <TabsContent value="list">
        {isLoading ? (
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
