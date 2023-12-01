import API from "../constants/api";
import { AppointmentType } from "../types/appointment";
import { PaginationType } from "../types/generalTypes";
import authAxiosInstance from "./authAxios";
import qs from "qs";

export async function createAppointment(appointment: AppointmentType) {
  const path = `${API.apiPath}/${API.appointment}`;
  const res = await authAxiosInstance.post(path, appointment);
  return res.data;
}

export async function getAppointments(pagination?: PaginationType) {
  const paginationPayload = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    page: pagination?.pagination?.current - 1 || 0,
    size: pagination?.pagination.pageSize || 10,
  };
  const path = `${API.apiPath}/${API.appointment}${
    pagination ? "?" + qs.stringify(paginationPayload) : ""
  }`;
  const res = await authAxiosInstance.get(path);
  return res.data;
}

export async function updateAppointment(appointment: AppointmentType, appointmentId: string) {
  const path = `${API.apiPath}/${API.appointment}/${appointmentId}`;
  const res = await authAxiosInstance.put(path, appointment);
  return res.data;
}

export async function deleteAppointment(appointmentId: string) {
  const path = `${API.apiPath}/${API.appointment}/${appointmentId}`;
  const res = await authAxiosInstance.delete(path);
  return res.data;
}