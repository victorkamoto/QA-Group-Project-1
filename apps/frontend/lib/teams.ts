import client from "./axiosInstance";
import { Team, CreateTeam, UpdateTeam } from "../types/team.types";
import { ApiRes } from "../types";

export async function createTeam(team: CreateTeam): Promise<ApiRes> {
  try {
    const response = await client.post("/teams", team);
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

export async function getTeams(): Promise<ApiRes> {
  try {
    const response = await client.get("/teams");
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

export async function getTeamById(id: string): Promise<ApiRes> {
  try {
    const response = await client.get(`/teams/${id}`);
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

export async function updateTeam(
  id: string,
  team: UpdateTeam
): Promise<ApiRes> {
  try {
    const response = await client.put(`/teams/${id}`, team);
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

export async function deleteTeam(id: string): Promise<ApiRes> {
  try {
    const response = await client.delete(`/teams/${id}`);
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

export async function joinTeam(
  teamId: string,
  userId: string
): Promise<ApiRes> {
  try {
    const response = await client.post("/teams/add", { teamId, userId });
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

export async function leaveTeam(
  teamId: string,
  userId: string
): Promise<ApiRes> {
  try {
    const response = await client.post("/teams/remove", { teamId, userId });
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
