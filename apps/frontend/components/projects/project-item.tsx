"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, FolderGit2, User } from "lucide-react";
import { Team } from "../../types/team.types";

interface ProjectItemProps {
  name: string;
  team: Partial<Team>;
  taskCount: number;
  onClick: () => void;
}

export default function ProjectItem({
  name,
  team,
  taskCount,
  onClick,
}: ProjectItemProps) {
  return (
    <Card
      className="w-[320px] h-[120px] transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{team.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{taskCount} tasks</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
