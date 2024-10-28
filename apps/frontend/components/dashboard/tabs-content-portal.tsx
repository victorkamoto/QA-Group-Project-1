"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import KanbanBoard from "./kanban";
import { TabsContent } from "../ui/tabs";

export function TabsPortalContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div>
      <TabsContent value="list">List view goes</TabsContent>
      <TabsContent value="kanban">
        <KanbanBoard />
      </TabsContent>
    </div>,
    document.getElementById("tabs-content-portal")!
  );
}
