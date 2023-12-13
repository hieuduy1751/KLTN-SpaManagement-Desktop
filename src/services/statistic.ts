import API from "../constants/api";
import authAxiosInstance from "./authAxios";

export async function getTopCustomer() {
  const path = `${API.apiPath}/statistic/topCustomer`
  const res = await authAxiosInstance.get(path)
  return res.data
}