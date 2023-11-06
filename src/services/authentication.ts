import API from "../constants/api";
import authAxiosInstance from "./authAxios";
import defaultAxiosInstance from "./defaultAxios";

export async function login(username: string, password: string) {
  const path = `${API.apiPath}/${API.authentication.login}?username=${username}&password=${password}`;
  const res = await defaultAxiosInstance.post(path)
  return res.data;
}

export async function register(username: string, password: string) {
  const path = `${API.apiPath}/${API.authentication.register}?username=${username}&password=${password}`;
  const res = await defaultAxiosInstance.post(path)
  return res.data;
}

export async function logout() {
  const path = `${API.apiPath}/${API.authentication.logout}`;
  const res = await authAxiosInstance.post(path)
  return res.data
}
