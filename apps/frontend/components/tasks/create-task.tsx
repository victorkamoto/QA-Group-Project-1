"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const createTaskSchema = z.object({
  description: z.string().min(8, {
    message: "Description must be at least 8 characters.",
  }),
  status: z.string().min(1, {
    message: "Status is required.",
  }),
  projectId: z.string().min(1, {
    message: "Project ID is required.",
  }),
  dueDate: z.date().default(() => {
    const date = new Date();
    date.setHours(23, 59, 0, 0);
    return date;
  }),
});

type FormData = z.infer<typeof createTaskSchema>;

interface TaskDialogProps {
  buttonText: string;
}

export function TaskDialog({ buttonText }: TaskDialogProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const createTask = store((state) => state.createTask);
  const projects = store((state) => state.projects);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: "backlog",
    },
  });

  async function onSubmit(data: FormData) {
    const { dueDate, projectId } = data;
    setIsLoading(true);
    const response = await createTask({
      ...data,
      dueDate: format(dueDate, "yyyy-MM-dd"),
      projectId: {
        xata_id: projectId,
      },
    });
    setIsLoading(false);

    if (response?.status !== 201) {
      return toast({
        title: "Something went wrong.",
        description: `Failed to create task. Please try again.`,
        variant: "destructive",
      });
    }

    toast({
      description: `Successfully created the task.`,
    });
  }

  const statuses = ["in-progress", "completed", "backlog", "review"];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task for your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="description"
                className="col-span-4"
                placeholder="Task"
                {...register("description")}
              />
            </div>
            {errors.description && (
              <p className="px-1 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Select
                defaultValue="backlog"
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger className="col-span-4">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.status && (
              <p className="px-1 text-xs text-red-600">
                {errors.status.message}
              </p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Select onValueChange={(value) => setValue("projectId", value)}>
                <SelectTrigger className="col-span-4">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.xata_id} value={project.xata_id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.projectId && (
              <p className="px-1 text-xs text-red-600">
                {errors.projectId.message}
              </p>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`col-span-4 justify-start text-left font-normal ${
                      !date && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(val) => {
                      setDate(val);
                      setValue("dueDate", val as Date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {errors.dueDate && (
              <p className="px-1 text-xs text-red-600">
                {errors.dueDate.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
