import Upload, { RcFile } from "antd/es/upload";
import API from "../constants/api";
import authAxiosFormDataInstance from "./authAxiosFormData";

export async function uploadImageService(image: any, config?: any) {
  const formData = new FormData();
  formData.append("file", image);
  const path = `${API.apiPath}/${API.image}`;
  const res = await authAxiosFormDataInstance.post(path, formData, config);
  return res.data;
}

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const beforeUploadImg = (file, message) => {
  const isImg = file.type.startsWith("image/");
  if (!isImg) {
    message.error(`${file.name} không phải là hình ảnh`);
  }
  return isImg || Upload.LIST_IGNORE;
};
