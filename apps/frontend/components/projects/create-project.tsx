import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { Icons } from "../icons";
import { store } from "../../store/store";

const createProjectSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  teamId: z.string().min(1, {
    message: "Team ID is required.",
  }),
});

type FormData = z.infer<typeof createProjectSchema>;

interface ProjectDialogProps {
  buttonText: string;
}

export function ProjectDialog({ buttonText }: ProjectDialogProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const createProject = store((state) => state.createProject);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createProjectSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    const { name, teamId } = data as z.infer<typeof createProjectSchema>;
    const response = await createProject({ name, teamId });
    setIsLoading(false);
    if (response?.status !== 201) {
      return toast({
        title: "Something went wrong.",
        description: `Failed to create project. Please try again.`,
        variant: "destructive",
      });
    }

    toast({
      description: `Successfully created the project.`,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{"Create Project"}</DialogTitle>
          <DialogDescription>
            Create a new project for your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="teamId"
                className="col-span-4"
                placeholder="Team ID"
                {...register("teamId")}
              />
            </div>
            {errors.teamId && (
              <p className="px-1 text-xs text-red-600">
                {errors.teamId.message}
              </p>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="name"
                className="col-span-4"
                placeholder="Project Name"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {"Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
