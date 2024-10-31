"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import KanbanBoard from "./kanban";
import { TabsContent } from "../ui/tabs";
import TaskItem from "../tasks/task-item";
import { Task } from "../../types/task.types";
import { store } from "../../store/store";

export function TabsPortalContent() {
  const [mounted, setMounted] = useState(false);
  const tasks = store((state) => state.tasks);
  const getTasks = store((state) => state.getTasks);
  useEffect(() => {
    setMounted(true);

    getTasks();
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div>
      <TabsContent value="list">
        {tasks.map((t) => (
          <TaskItem task={t} key={t.xata_id} />
        ))}
      </TabsContent>
      <TabsContent value="kanban">
        <KanbanBoard />
      </TabsContent>
    </div>,
    document.getElementById("tabs-content-portal")!
  );
}
