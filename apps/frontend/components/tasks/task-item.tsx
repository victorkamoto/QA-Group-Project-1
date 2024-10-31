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

interface TaskListItemProps {
  task: Task;
}

export default function TaskItem({
  task: { description, dueDate, projectId, assignedToId, status },
}: TaskListItemProps) {
  const getMembers = store((state) => state.getMembersByTeamId);
  const [date, setDate] = useState<Date | undefined>(new Date(dueDate));
  const [members, setMembers] = useState<any>([]);

  useEffect(() => {
    getMembers(projectId.teamId.xata_id).then((m) => {
      let entries = m.data.map((each: any) => each.userId);
      setMembers(entries);
    });
  }, []);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    // TODO: update date
  };

  const handleStatusChange = (newStatus: string) => {
    // TODO: update status
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
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-[40%]">
            <h3 className="font-semibold truncate">{description}</h3>
          </div>
          <div className="flex items-center space-x-8">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex gap-1 text-sm p-2 h-auto"
                >
                  <CalendarClock className="w-4 h-4" />
                  {date &&
                    formatDistanceToNow(date, {
                      addSuffix: true,
                    })}
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
            <span className="flex gap-1 text-sm cursor-not-allowed">
              <FolderKanban className="w-4 h-4" /> {projectId.name}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  <span className="sr-only">Change status</span>
                  <Badge
                    className={`${getStatusColor(
                      status
                    )} text-white w-[90px] flex justify-center items-center`}
                  >
                    {status}
                  </Badge>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {...statuses
                  .filter((s) => s != status)
                  .map((opt) => {
                    return (
                      <DropdownMenuItem
                        onClick={() => handleStatusChange("in-progress")}
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
                  {members
                    .filter((m: any) => m.xata_id != assignedToId.xata_id)
                    .map((m: any) => (
                      <>
                        <div className="flex gap-1 justify-center items-center cursor-pointer hover:bg-slate-200 hover:rounded p-1">
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
            <Button
              variant={"ghost"}
              size={"sm"}
              className="hover:bg-red-500 hover:text-white text-red-500"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
