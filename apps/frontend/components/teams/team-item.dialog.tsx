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
import { Pencil, Trash2, FolderGit2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { Icons } from "../icons";
import { store } from "../../store/store";
import { Project } from "../../types/project.types";

const updateTeamSchema = z.object({
  name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  description: z.string(),
});

type FormData = z.infer<typeof updateTeamSchema>;

interface TeamItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamDescription: string;
  projects: Project[];
  teamId: string;
}

export default function TeamItemDialog({
  isOpen = false,
  onClose,
  teamName,
  teamDescription,
  projects,
  teamId,
}: TeamItemDialogProps) {
  const updateTeam = store((state) => state.updateTeam);
  const deleteTeam = store((state) => state.deleteTeam);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      name: teamName,
      description: teamDescription,
    },
  });

  useEffect(() => {
    if (isEditMode) {
      reset({
        name: teamName,
        description: teamDescription,
      });
    }
  }, [isEditMode, teamName, teamDescription, reset]);

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const { name, description } = data;
    const adminId = JSON.parse(localStorage.getItem("auth") || "").userId;
    const response = await updateTeam(teamId, { name, description, adminId });
    setIsLoading(false);
    if (response?.status !== 200) {
      return toast({
        title: "Something went wrong.",
        description: `Failed to update team. Please try again.`,
        variant: "destructive",
      });
    }

    toast({
      description: `Successfully updated the team.`,
    });
  }

  const handleEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await deleteTeam(teamId);
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
              <DialogTitle>{teamName}</DialogTitle>
              <DialogDescription>{teamDescription}</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <h4 className="mb-4 text-sm font-medium">Projects</h4>
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li
                    key={project.xata_id}
                    className="flex items-center space-x-2"
                  >
                    <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{project.name}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{teamName}</DialogTitle>
            </DialogHeader>
            <form>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="name"
                    className="col-span-4"
                    placeholder="Team Name"
                    defaultValue={teamName}
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="description"
                    className="col-span-4"
                    placeholder="Team Description"
                    defaultValue={teamDescription}
                    {...register("description")}
                  />
                </div>
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
