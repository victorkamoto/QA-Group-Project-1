import { ApiRes } from "../types";
import client from "./axiosInstance";
import * as jose from "jose";

interface IAuth {
  name?: string;
  email: string;
  password: string;
  role?: string;
}

type ILogin = Pick<IAuth, "email" | "password">;

type DecodedJwt = {
  userId: string;
};

type Jwt = DecodedJwt | null;

export const signup = async (data: IAuth): Promise<ApiRes> => {
  try {
    const response = await client.post(
      "/auth/register",
      {
        ...data,
      },
      {
        headers: { auth: true },
      }
    );
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
};

export const login = async (data: ILogin): Promise<ApiRes> => {
  try {
    const response = await client.post(
      "/auth/login",
      {
        ...data,
      },
      {
        headers: { auth: true },
      }
    );

    const { token } = response.data;

    localStorage.setItem("accessToken", token);

    const decoded: Jwt = jose.decodeJwt<DecodedJwt>(token);

    const user = await getUser(decoded?.userId);

    localStorage.setItem("auth", JSON.stringify(user));

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
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("auth");
};

export const getUser = async (id: string): Promise<ApiRes> => {
  try {
    const response = await client.get(`/users/${id}`);
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
  const response = await client.get(`/users/${id}`);
};
