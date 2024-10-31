import client from "./axiosInstance";
import { Task, CreateTask, UpdateTask } from "../types/task.types";
import { ApiRes } from "../types";

export async function createTask(task: CreateTask): Promise<ApiRes> {
  try {
    const response = await client.post("/tasks", task);
    return {
      status: response.status,
      message: response.data?.message,
      data: response.data?.details,
    };
  } catch (error: any) {
    return {
      status: error.status,
      message: error.response?.data?.message,
    };
  }
}

export async function getTasks(): Promise<ApiRes> {
  try {
    const response = await client.get("/tasks");
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    return {
      status: error.status,
      message: error.response?.data?.message,
    };
  }
}

export async function getTaskById(id: string): Promise<ApiRes> {
  try {
    const response = await client.get(`/tasks/${id}`);
    return {
      status: response.status,
      message: response.data?.message,
      data: response.data?.details,
    };
  } catch (error: any) {
    return {
      status: error.status,
      message: error.response?.data?.message,
    };
  }
}

export async function updateTask(
  id: string,
  task: UpdateTask
): Promise<ApiRes> {
  try {
    const response = await client.patch(`/tasks/${id}`, task);
    return {
      status: response.status,
      message: response.data?.message,
      data: response.data?.details,
    };
  } catch (error: any) {
    return {
      status: error.status,
      message: error.response?.data?.message,
    };
  }
}

export async function deleteTask(id: string): Promise<ApiRes> {
  try {
    const response = await client.delete(`/tasks/${id}`);
    return {
      status: response.status,
      message: response.data?.message,
    };
  } catch (error: any) {
    return {
      status: error.status,
      message: error.response?.data?.message,
    };
  }
}
