"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { store } from "../../store/store";
import { toast } from "../ui/use-toast";
import { Task } from "../../types/task.types";
import { Badge } from "../ui/badge";

interface KanbanBoardProps {
  tasks: Task[];
}
export default function KanbanBoard({ tasks }: KanbanBoardProps) {
  const updateTask = store((state) => state.updateTask);
  const kanban = store((state) => state.kanban);
  const setKanban = store((state) => state.setKanban);

  useEffect(() => {
    let columns = [...kanban];
    tasks.map((task) => {
      const column = columns.find((col) => {
        switch (task.status) {
          case "backlog":
            return col.id === "backlog";
          case "in-progress":
            return col.id === "in-progress";
          case "review":
            return col.id === "review";
          case "completed":
            return col.id === "completed";
          default:
            return col.id === "backlog";
        }
      });

      if (column) {
        const taskExists = column.tasks.some((t) => t.xata_id === task.xata_id);
        if (!taskExists) {
          column.tasks.push(task);
        }
      }
      columns = columns.map((col) => {
        if (col.id === column?.id) {
          return column;
        }
        return col;
      });
      setKanban(columns);
    });
  }, [tasks]);

  const strictModeDroppable = useStrictDroppable(true);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = kanban.find((col) => col.id === source.droppableId);
    const destColumn = kanban.find((col) => col.id === destination.droppableId);

    if (sourceColumn && destColumn) {
      const sourceTasks = Array.from(sourceColumn.tasks);
      const destTasks =
        source.droppableId === destination.droppableId
          ? sourceTasks
          : Array.from(destColumn.tasks);

      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      const newColumns = kanban.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, tasks: sourceTasks };
        }
        if (col.id === destination.droppableId) {
          return { ...col, tasks: destTasks };
        }
        return col;
      });

      setKanban(newColumns);

      try {
        const response = await updateTask(removed.xata_id, {
          status: destination.droppableId,
        });

        if (response.status !== 200) {
          setKanban(kanban);
          toast({
            title: "Error",
            description: "Failed to update task status. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            description: "Task status updated!",
          });
        }
      } catch (error) {
        setKanban(kanban);
        toast({
          title: "Error",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "backlog":
        return "bg-gray-500";
      case "review":
        return "bg-purple-500";
      default:
        return "bg-blue-500";
    }
  };
  return (
    <div className="p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kanban.map((column) => (
            <Card key={column.id}>
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-center items-center">
                    <Badge
                      className={`${getStatusColor(
                        column.id
                      )} text-white w-[90px] flex justify-center items-center p-1`}
                    >
                      {column.title}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {strictModeDroppable ? (
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-[200px]"
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable
                            key={task.xata_id}
                            draggableId={task.xata_id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-secondary p-2 mb-2 rounded"
                              >
                                {task.description}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

// Workaround for react-beautiful-dnd in React 18 Strict Mode
const useStrictDroppable = (enabled: boolean) => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;

    const animation = requestAnimationFrame(() => {
      if (mounted) {
        setIsEnabled(enabled);
      }
    });

    return () => {
      mounted = false;
      cancelAnimationFrame(animation);
    };
  }, [enabled]);

  return isEnabled;
};
