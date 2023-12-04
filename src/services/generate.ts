import API from "../constants/api";
import authAxiosInstance from "./authAxios";

export async function generateInvoice(invoiceId: string) {
  const path = `${API.apiPath}/generating/invoice/${invoiceId}?fileFormat=pdf&uploadDir=/Users/hieud/Downloads`
  const res = await authAxiosInstance.post(path)
  return res.data
}