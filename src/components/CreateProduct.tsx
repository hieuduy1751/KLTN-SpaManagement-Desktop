import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  notification,
  Form,
  Input,
  Modal,
  Upload,
  InputNumber,
  Select,
  message,
  UploadProps,
  UploadFile,
} from "antd";
import { useState } from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import {
  beforeUploadImg,
  getBase64,
  uploadImageService,
} from "../services/image";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { ProductType } from "../types/product";
import PRODUCT_TYPE from "../constants/product-type";
import { addService } from "../store/slices/serviceSlice";
import PRODUCT_CATEGORY from "../constants/product-cateogry";
import { addProduct } from "../store/slices/productSlice";

type NotificationType = "success" | "info" | "warning" | "error";

export type CreateProductProps = {
  modalOpen: boolean;
  setModalOpen: any;
  productType: "SERVICE" | "TREATMENT" | "PRODUCT";
};

const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function CreateProduct({
  modalOpen,
  setModalOpen,
  productType,
}: CreateProductProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingIMG, setLoadingIMG] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [imageUrl, setImageUrl] = useState<string>();

  const openNotificationWithIcon = (
    type: NotificationType,
    title,
    description
  ) => {
    api[type]({
      message: title,
      description,
    });
  };

  const validateMessages = {
    required: "${label} không được để trống!",
    types: {
      email: "${label} không hợp lệ!",
      number: "${label} không hợp lệ!",
    },
  };

  const handleOnCreate = () => {
    if (form) {
      form.submit();
    }
  };

  const handleOnCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  const handleOnFinish = async (values: any) => {
    const newProduct: ProductType = {
      ...values,
    };
    setLoading(true);
    try {
      if (productType === "SERVICE") {
        await dispatch(addService(newProduct));
      } else if (productType === "PRODUCT") {
        await dispatch(addProduct(newProduct));
      }
      setLoading(false);
      setModalOpen(false);
      openNotificationWithIcon(
        "success",
        "Thành công",
        `Thêm ${PRODUCT_TYPE[productType]} thành công!`
      );
      form.resetFields();
      setImageUrl("");
    } catch (err: any) {
      openNotificationWithIcon("error", "Thất bại", err.message);
    }
  };

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoadingIMG(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoadingIMG(false);
        setImageUrl(url);
      });
    }
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        setLoadingIMG(true);
        if (percent === 100) {
          setLoadingIMG(false);
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    try {
      const res = await uploadImageService(file, config);
      onSuccess("Ok");
      setImageUrl(res);
      form.setFieldValue("imageUrl", res);
    } catch (err) {
      console.log("Eroor: ", err);
      onError({ err });
    }
  };

  const uploadButton = (
    <div>
      {loadingIMG ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  return (
    <Modal
      title={`Tạo ${PRODUCT_TYPE[productType]} mới`}
      centered
      open={modalOpen}
      onOk={handleOnCreate}
      onCancel={handleOnCancel}
      confirmLoading={loading}
      width={500}
      okText={`Tạo ${PRODUCT_TYPE[productType]}`}
      cancelText="Hủy bỏ"
    >
      {contextHolder}
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        className="h-[60vh] overflow-auto px-3"
        form={form}
        onFinish={handleOnFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          label="Ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            accept="image/*"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            customRequest={uploadImage}
            beforeUpload={(file) => beforeUploadImg(file, message)}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "150%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <Form.Item name="imageUrl" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          rules={[{ required: true }]}
          label="Tên sản phẩm"
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          rules={[{ required: true }]}
          label="Mô tả"
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          name="price"
          rules={[
            { required: true },
            {
              pattern: /^[0-9]{1,10}$/,
              message: "Giá phải là số",
            },
          ]}
          label="Giá"
        >
          <InputNumber className="w-full" />
        </Form.Item>
        {productType === "PRODUCT" && (
          <>
            <Form.Item
              name="quantity"
              rules={[
                { required: true },
                {
                  pattern: /^[0-9]{1,10}$/,
                  message: "Số lượng phải là số",
                },
              ]}
              label="Số lượng"
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item
              name="supplier"
              label="Nhà cung cấp"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </>
        )}
        <Form.Item initialValue={1} name="quantity" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          initialValue={productType}
          rules={[{ required: true }]}
          name="productType"
          label="Phân loại"
        >
          <Select
            // onChange={handleChange}
            disabled
            options={Object.keys(PRODUCT_TYPE).map((k) => ({
              value: k,
              label: PRODUCT_TYPE[k],
            }))}
          />
        </Form.Item>
        {productType === "PRODUCT" && (
          <Form.Item
            initialValue={'SKINCARE'}
            rules={[{ required: true }]}
            name="category"
            label="Dòng sản phẩm"
          >
            <Select
              options={Object.keys(PRODUCT_CATEGORY).map((k) => ({
                value: k,
                label: PRODUCT_CATEGORY[k],
              }))}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
