import apisauce from "apisauce";
import * as consts from "../consts";
import * as utils from "../utils";
import { UserLoginResponse, UserSignupResponse } from "../types";

export const login = async (email: string, password: string) => {
  const api = apisauce.create({ baseURL: consts.BASE_API_URL });

  return api.post<UserLoginResponse>("/users/login", {
    email,
    password,
  });
};

export const signup = async (email: string, password: string) => {
  const api = apisauce.create({ baseURL: consts.BASE_API_URL });

  return api.post<UserSignupResponse>("/users/signup", {
    email,
    password,
  });
};

export const logout = async () => {
  const token = utils.auth.getToken();

  const api = apisauce.create({
    baseURL: consts.BASE_API_URL,
    headers: {
      authorization: token,
    },
  });

  return api.post<{}>("/users/logout", {});
};
