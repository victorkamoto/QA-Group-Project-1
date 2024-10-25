"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2, FolderGit2, ClipboardList } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { Icons } from "../icons";
import { store } from "../../store/store";
import { Project } from "../../types/project.types";
import { updateProject } from "../../lib/projects";
import { Task } from "../../types/task.types";
import { Team } from "../../types/team.types";

const updateProjectSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  teamId: z.string(),
});

type FormData = z.infer<typeof updateProjectSchema>;

interface ProjectItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  projectId: string;
  tasks: Partial<Task[]>;
  team: Partial<Team>;
}

export default function ProjectItemDialog({
  isOpen = false,
  onClose,
  projectName,
  team: { xata_id: teamId, name: teamName },
  tasks,
  projectId,
}: ProjectItemDialogProps) {
  const updateProject = store((state) => state.updateProject);
  const deleteProject = store((state) => state.deleteProject);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: projectName,
      teamId: teamId,
    },
  });

  useEffect(() => {
    if (isEditMode) {
      reset({
        name: projectName,
        teamId: teamId,
      });
    }
  }, [isEditMode, projectName, teamId, reset]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const { name, teamId } = data;
    const response = await updateProject(projectId, {
      name,
      teamId,
    });
    setIsLoading(false);
    if (response?.status !== 200) {
      return toast({
        title: "Something went wrong.",
        description: `Failed to update project. Please try again.`,
        variant: "destructive",
      });
    }

    toast({
      description: `Successfully updated the project.`,
    });
  }

  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await deleteProject(projectId);
    setIsLoading(false);

    if (response?.status !== 200) {
      return toast({
        title: "Something went wrong.",
        description: `Failed to delete team. Please try again.`,
        variant: "destructive",
      });
    }

    toast({
      description: `Successfully deleted the team.`,
    });

    onClose();
  };

  const handleSave = handleSubmit(async (data) => {
    setIsLoading(true);
    await onSubmit(data);
    handleClose();
  });

  const handleClose = () => {
    setIsEditMode(false);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        {!isEditMode ? (
          <>
            <DialogHeader>
              <DialogTitle>{projectName}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center space-x-2">
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{teamName}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <h4 className="mb-4 text-sm font-medium">Tasks</h4>
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task?.xata_id}
                    className="flex items-center space-x-2"
                  >
                    <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{task?.description}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{projectName}</DialogTitle>
            </DialogHeader>
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="description"
                    className="col-span-4"
                    placeholder="Project ID"
                    defaultValue={teamId}
                    {...register("teamId")}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="name"
                    className="col-span-4"
                    placeholder="Project Name"
                    defaultValue={projectName}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </form>
          </>
        )}
        <DialogFooter>
          {!isEditMode && (
            <>
              <Button variant="outline" onClick={handleEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          {isEditMode && (
            <Button variant="outline" onClick={() => setIsEditMode(false)}>
              Back
            </Button>
          )}
          <Button
            onClick={isEditMode ? handleSave : handleClose}
            disabled={isLoading}
          >
            {isEditMode ? "Save" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
