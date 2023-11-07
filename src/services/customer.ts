import API from "../constants/api";
import { CustomerType } from "../types/customer";
import { PaginationType } from "../types/generalTypes";
import authAxiosInstance from "./authAxios";
import qs from "qs";

export async function getCustomers(pagination?: PaginationType) {
  const paginationPayload = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    page: pagination?.pagination?.current - 1 || 0,
    size: pagination?.pagination.pageSize || 10,
  };
  const path = `${API.apiPath}/${API.customer}${
    pagination ? "?" + qs.stringify(paginationPayload) : ""
  }`;
  const res = await authAxiosInstance.get(path);
  return res.data;
}

export async function createCustomer(customer: CustomerType) {
  const path = `${API.apiPath}/${API.customer}`;
  const res = await authAxiosInstance.post(path, customer);
  return res.data;
}

export async function updateCustomer(
  customer: CustomerType,
  customerId: string
) {
  const path = `${API.apiPath}/${API.customer}/${customerId}`;
  const res = await authAxiosInstance.put(path, customer);
  return res.data;
}

export async function deleteCustomer(customerId: string) {
  const path = `${API.apiPath}/${API.customer}/${customerId}`;
  const res = await authAxiosInstance.delete(path);
  return res.data;
}
