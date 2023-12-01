import API from "../constants/api";
import { StaffType } from "../types/staff";
import { PaginationType } from "../types/generalTypes";
import authAxiosInstance from "./authAxios";
import qs from "qs";

export async function getStaffs(pagination?: PaginationType) {
  const paginationPayload = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    page: pagination?.pagination?.current - 1 || 0,
    size: pagination?.pagination.pageSize || 10,
  };
  const path = `${API.apiPath}/${API.staff}${
    pagination ? "?" + qs.stringify(paginationPayload) : ""
  }`;
  const res = await authAxiosInstance.get(path);
  return res.data;
}

export async function createStaff(staff: StaffType) {
  const path = `${API.apiPath}/${API.staff}`;
  const res = await authAxiosInstance.post(path, staff);
  return res.data;
}

export async function updateStaff(
  staff: StaffType,
  staffId: string
) {
  const path = `${API.apiPath}/${API.staff}/${staffId}`;
  const res = await authAxiosInstance.put(path, staff);
  return res.data;
}

export async function deleteStaff(staffId: string) {
  const path = `${API.apiPath}/${API.staff}/${staffId}`;
  const res = await authAxiosInstance.delete(path);
  return res.data;
}

export async function createStaffAccount(staffId: string, username: string, password: string, passwordConfirm: string) {
  const path = `${API.apiPath}/${API.staff}/register/${staffId}`
  const payload = {
    username,
    password,
    passwordConfirm
  }
  const res = await authAxiosInstance.post(path, payload)
  return res.data
}

export async function searchStaffByName(name: string) {
  const path = `${API.apiPath}/${API.staff}/search?text=${name}`
  const res = await authAxiosInstance.get(path)
  return res.data
}