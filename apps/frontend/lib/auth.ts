import client from "./axiosInstance";
import * as jose from "jose";

interface IAuth {
  name?: string;
  email: string;
  password: string;
}

type ILogin = Pick<IAuth, "email" | "password">;

type DecodedJwt = {
  userId: string;
};

type Jwt = DecodedJwt | null;

type AuthRes = {
  status: number;
  message: string;
};

export const signup = async (data: IAuth): Promise<AuthRes> => {
  try {
    const response = await client.post(
      "/users/register",
      {
        ...data,
      },
      {
        headers: { auth: true },
      },
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

export const login = async (data: ILogin): Promise<AuthRes> => {
  try {
    const response = await client.post(
      "/users/login",
      {
        ...data,
      },
      {
        headers: { auth: true },
      },
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

export const getUser = async (id: string) => {
  const response = await client.get(`/users/${id}`);
  return response.data;
};
