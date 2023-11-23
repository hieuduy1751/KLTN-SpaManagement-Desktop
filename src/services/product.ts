import API from "../constants/api";
import { PaginationType } from "../types/generalTypes";
import { ProductType } from "../types/product";
import authAxiosInstance from "./authAxios";
import qs from "qs";

export async function createProduct(product: ProductType) {
  const path = `${API.apiPath}/${API.product}`;
  const res = await authAxiosInstance.post(path, product);
  return res.data;
}

export async function getProducts(categoryName: string, pagination?: PaginationType) {
  const paginationPayload = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    page: pagination?.pagination?.current - 1 || 0,
    size: pagination?.pagination.pageSize || 10,
    categoryName
  };
  const path = `${API.apiPath}/${API.product}type${
    pagination ? "?" + qs.stringify(paginationPayload) : ""
  }`;
  const res = await authAxiosInstance.get(path);
  return res.data;
}

export async function updateProduct(product: ProductType, productId: string) {
  const path = `${API.apiPath}/${API.product}${productId}`;
  const res = await authAxiosInstance.put(path, product);
  return res.data;
}

export async function deleteProduct(productId: string) {
  const path = `${API.apiPath}/${API.product}${productId}`;
  const res = await authAxiosInstance.delete(path);
  return res.data;
}