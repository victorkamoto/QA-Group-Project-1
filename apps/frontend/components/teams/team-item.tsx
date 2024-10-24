"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderGit2 } from "lucide-react";

interface TeamItemProps {
  name: string;
  description: string;
  memberCount: number;
  projectCount: number;
  onClick: () => void;
}

export default function TeamItem({
  name,
  description,
  memberCount,
  projectCount,
  onClick,
}: TeamItemProps) {
  return (
    <Card
      className="w-[320px] h-[180px] transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {description}
        </p>
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{memberCount} members</span>
          </div>
          <div className="flex items-center space-x-2">
            <FolderGit2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{projectCount} projects</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
