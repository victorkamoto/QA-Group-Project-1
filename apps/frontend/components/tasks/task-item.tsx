"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Trash,
  CalendarClock,
  FolderKanban,
  CircleFadingPlus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { store } from "../../store/store";
import { Project } from "../../types/project.types";
import { Task } from "../../types/task.types";
import { toast } from "../ui/use-toast";
import { Icons } from "../icons";

interface TaskListItemProps {
  task: Task;
}

export default function TaskItem({
  task: { xata_id, description, dueDate, projectId, assignedToId, status },
}: TaskListItemProps) {
  const getUser = store((state) => state.getUser);
  const getMembers = store((state) => state.getMembersByTeamId);
  const updateTask = store((state) => state.updateTask);
  const deleteTask = store((state) => state.deleteTask);
  const [date, setDate] = useState<Date | undefined>(new Date(dueDate));
  const [members, setMembers] = useState<any>([]);

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    getMembers(projectId.teamId.xata_id).then((m) => {
      let entries = m.data.map((each: any) => each.userId);
      setMembers(entries);
    });
  }, []);

  const handleDateChange = async (newDate: Date | undefined) => {
    setDate(newDate);
    const str = newDate?.toISOString();

    try {
      const response = await updateTask(xata_id, {
        dueDate: str,
      });

      if (response.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to update task date. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          description: "Task date updated!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task date. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await updateTask(xata_id, {
        status: newStatus,
      });

      if (response.status !== 200) {
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
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAssigneeChange = async (userId: string) => {
    try {
      const { data } = await getUser(userId);
      const response = await updateTask(xata_id, {
        assignedToId: data,
      });

      if (response.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to update task assignee. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          description: "Task assignee updated!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task assignee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await deleteTask(xata_id);

      setDeleteLoading(false);
      if (response.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          description: "Task deleted successfully!",
        });
      }
    } catch (error) {
      setDeleteLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const statuses = ["in-progress", "completed", "backlog", "review"];
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
    <Card className="mb-4 hover:shadow-md cursor-pointer">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-0 items-center">
          <div className="flex col-span-1 lg:col-span-3">
            <h3 className="font-semibold truncate">{description}</h3>
          </div>
          <div className="col-span-1 lg:col-span-5">
            <div className="grid grid-cols-4 lg:grid-cols-10 gap-4 lg:gap-0">
              <div className="flex items-center justify-start lg:justify-center col-span-1 lg:col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex gap-1 text-sm p-2 h-auto"
                    >
                      <CalendarClock className="w-4 h-4" />
                      <span className="hidden lg:inline">
                        {date &&
                          formatDistanceToNow(date, {
                            addSuffix: true,
                          })}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="hidden lg:flex items-center justify-center col-span-3">
                <span className="flex gap-1 text-sm cursor-not-allowed">
                  <FolderKanban className="w-4 h-4" /> {projectId.name}
                </span>
              </div>
              <div className="flex items-center justify-center col-span-1 lg:col-span-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer">
                      <span className="sr-only">Change status</span>
                      <Badge
                        className={`${getStatusColor(
                          status
                        )} text-white md:w-[90px] flex justify-center items-center`}
                      >
                        <span className="hidden sm:inline">{status}</span>
                      </Badge>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {...statuses
                      .filter((s) => s != status)
                      .map((opt) => {
                        return (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(opt)}
                            className="text-center"
                            key={opt}
                          >
                            <Badge
                              className={`${getStatusColor(
                                opt
                              )} text-white w-full flex justify-center items-center`}
                            >
                              {opt}
                            </Badge>
                          </DropdownMenuItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-center col-span-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="cursor-pointer">
                      {assignedToId ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {assignedToId?.name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <CircleFadingPlus className="text-gray-500 hover:text-black" />
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex-col space-y-1 p-1">
                      {members.map((m: any) => (
                        <>
                          <div
                            key={m.xata_id}
                            onClick={() => handleAssigneeChange(m.xata_id)}
                            className="flex gap-1 justify-center items-center cursor-pointer hover:bg-slate-200 hover:rounded p-1"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {m.name
                                  .split(" ")
                                  .map((n: any) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{m.name}</span>
                          </div>{" "}
                        </>
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-center col-span-1">
                <Button
                  onClick={handleDelete}
                  variant={"ghost"}
                  size={"sm"}
                  className="hover:bg-red-500 hover:text-white text-red-500"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
