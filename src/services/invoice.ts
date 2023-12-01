import API from "../constants/api";
import { PaginationType } from "../types/generalTypes";
import { InvoiceType } from "../types/invoice";
import authAxiosInstance from "./authAxios";
import qs from "qs";

export async function createInvoice(invoice: InvoiceType) {
  const path = `${API.apiPath}/${API.invoice}`;
  const res = await authAxiosInstance.post(path, invoice);
  return res.data;
}

export async function getInvoices(pagination?: PaginationType) {
  const paginationPayload = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    page: pagination?.pagination?.current - 1 || 0,
    size: pagination?.pagination.pageSize || 10,
  };
  const path = `${API.apiPath}/${API.invoice}${
    pagination ? "?" + qs.stringify(paginationPayload) : ""
  }`;
  const res = await authAxiosInstance.get(path);
  return res.data;
}

export async function updateInvoice(invoice: InvoiceType, invoiceId: string) {
  const path = `${API.apiPath}/${API.invoice}/${invoiceId}`;
  const res = await authAxiosInstance.put(path, invoice);
  return res.data;
}

export async function deleteInvoice(invoiceId: string) {
  const path = `${API.apiPath}/${API.invoice}/${invoiceId}`;
  const res = await authAxiosInstance.delete(path);
  return res.data;
}