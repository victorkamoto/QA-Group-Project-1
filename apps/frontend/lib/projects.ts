import client from "./axiosInstance";
import { CreateProject, UpdateProject } from "../types/project.types";
import { ApiRes } from "../types";

export async function createProject(project: CreateProject): Promise<ApiRes> {
  try {
    const response = await client.post("/projects", project);
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

export async function getProjects(): Promise<ApiRes> {
  try {
    const response = await client.get("/projects");
    return {
      status: response.status,
      data: response.data?.details,
    };
  } catch (error: any) {
    return {
      status: error.status,
      message: error.response?.data?.message,
    };
  }
}

export async function getProjectById(id: string): Promise<ApiRes> {
  try {
    const response = await client.get(`/projects/${id}`);
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

export async function getProjectByTeamId(id: string): Promise<ApiRes> {
  try {
    const response = await client.get(`/projects/?teamId=${id}`);
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

export async function updateProject(
  id: string,
  project: UpdateProject
): Promise<ApiRes> {
  try {
    const response = await client.put(`/projects/${id}`, project);
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

export async function deleteProject(id: string): Promise<ApiRes> {
  try {
    const response = await client.delete(`/projects/${id}`);
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
