import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import { Icons } from "./icons";
import { createTeam, joinTeam } from "../lib/teams";

const createTeamSchema = z.object({
  name: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  description: z.string(),
});

const joinTeamSchema = z.object({
  teamId: z.string().min(1, {
    message: "Team ID is required.",
  }),
});

type FormData =
  | z.infer<typeof createTeamSchema>
  | z.infer<typeof joinTeamSchema>;

interface TeamDialogProps {
  type: "create" | "join";
  buttonText: string;
}

export function TeamDialog({ type, buttonText }: TeamDialogProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(
      type === "create" ? createTeamSchema : joinTeamSchema
    ),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    if (type === "create") {
      const { name, description } = data as z.infer<typeof createTeamSchema>;
      const adminId = JSON.parse(localStorage.getItem("auth") || "").userId;
      const response = await createTeam({ name, description, adminId });
      setIsLoading(false);
      if (response?.status !== 201) {
        return toast({
          title: "Something went wrong.",
          description: `Failed to create team. Please try again.`,
          variant: "destructive",
        });
      }

      toast({
        description: `Successfully created the team.`,
      });
    } else {
      const { teamId } = data as z.infer<typeof joinTeamSchema>;
      const userId = JSON.parse(localStorage.getItem("auth") || "").userId;

      const response = await joinTeam(teamId, userId);
      setIsLoading(false);
      if (response?.status !== 200) {
        return toast({
          title: "Something went wrong.",
          description: `Failed to join team. Please try again.`,
          variant: "destructive",
        });
      }

      toast({
        description: `Successfully joined the team.`,
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={type === "create" ? "default" : "outline"}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "Create Team" : "Join Team"}
          </DialogTitle>
          <DialogDescription>
            {type === "create"
              ? "Create a new team to collaborate with others."
              : "Enter the team ID to join an existing team."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {type === "create" ? (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="name"
                    className="col-span-4"
                    placeholder="Team Name"
                    {...register("name")}
                  />
                </div>
                {"name" in errors && errors.name && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="description"
                    className="col-span-4"
                    placeholder="Team Description"
                    {...register("description")}
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="teamId"
                  className="col-span-4"
                  placeholder="Team ID"
                  {...register("teamId")}
                />
              </div>
            )}
            {"teamId" in errors && errors.teamId && (
              <p className="px-1 text-xs text-red-600">
                {errors.teamId.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {type === "create" ? "Create" : "Join"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
