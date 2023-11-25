import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Spin,
  Tabs,
  Tag,
  Upload,
  message,
  notification,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { Pencil, Settings, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  beforeUploadImg,
  getBase64,
  uploadImageService,
} from "../services/image";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload";
import PRODUCT_TYPE from "../constants/product-type";
import PRODUCT_STATUS from "../constants/product-status";
import { editService, removeService } from "../store/slices/serviceSlice";
import { editProduct, removeProduct } from "../store/slices/productSlice";
import PRODUCT_CATEGORY from "../constants/product-cateogry";

export type ProductDetailProps = {
  modalOpen: boolean;
  setModalOpen: any;
  productType: "SERVICE" | "PRODUCT" | "TREATMENT";
};

export default function ProductDetail({
  modalOpen,
  setModalOpen,
  productType,
}: ProductDetailProps) {
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingIMG, setLoadingIMG] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const dispatch = useAppDispatch();
  const product = useAppSelector((state) => {
    if (productType === "SERVICE") {
      return state.services.selectedService;
    } else if (productType === "PRODUCT") {
      return state.products.selectedProduct;
    }
  });
  const [api, contextHolder] = notification.useNotification();
  const handleOnCancel = () => {
    setModalOpen(false);
    if (form) {
      form.resetFields();
    }
  };

  const validateMessages = {
    required: "${label} không được để trống!",
    types: {
      email: "${label} không hợp lệ!",
      number: "${label} không hợp lệ!",
    },
  };

  const handleDeleteProduct = async () => {
    try {
      if (product?.id) {
        if (productType === "SERVICE") {
          await dispatch(removeService(product?.id));
        } else if (productType === "PRODUCT") {
          await dispatch(removeProduct(product?.id));
        }
        api.success({
          message: "Thành công",
          description: `Xóa ${PRODUCT_TYPE[productType]} thành công`,
        });
      }
    } catch (err: any) {
      api.error({
        message: "Thất bại",
        description: `Xóa ${PRODUCT_TYPE[productType]} thất bại`,
      });
    }
  };

  const handleOnProductEdit = async () => {
    const formValues = form.getFieldsValue();
    console.log(formValues);
    try {
      if (productType === "SERVICE") {
        await dispatch(
          editService({
            service: formValues,
            serviceId: product?.id || "",
          })
        );
      } else if (productType === "PRODUCT") {
        await dispatch(
          editProduct({
            product: formValues,
            productId: product?.id || "",
          })
        );
      }
      api.success({
        message: "Thành công",
        description: `Cập nhật ${PRODUCT_TYPE[productType]} thành công!`,
      });
      setIsDisabled(true);
    } catch (err: any) {
      console.log(err);
      api.error({
        message: "Thất bại",
        description: err?.message,
      });
    }
  };

  const handleOnCancelEdit = () => {
    setIsDisabled(true);
    form.setFieldsValue({
      ...product,
    });
    setImageUrl(product?.imageUrl || "");
  };

  const uploadButton = (
    <div>
      {loadingIMG ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

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

  const tabsMenu = [
    {
      key: "product",
      label: (
        <span className="flex items-center">
          <User />
          Thông tin {PRODUCT_TYPE[productType]}
        </span>
      ),
      children: (
        <Row>
          <Col span={8} className="gap-4 flex flex-col items-center">
            <Upload
              accept="image/*"
              listType="picture-card"
              className="avatar-uploader text-center"
              showUploadList={false}
              customRequest={uploadImage}
              beforeUpload={(file) => beforeUploadImg(file, message)}
              onChange={handleChange}
              disabled={isDisabled}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "150%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
            <Tag>{PRODUCT_TYPE[productType]}</Tag>
          </Col>
          <Col span={16}>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"
              layout="horizontal"
              className="h-[60vh] overflow-auto px-3"
              form={form}
              validateMessages={validateMessages}
            >
              {isDisabled && (
                <Button
                  onClick={() => setIsDisabled(false)}
                  icon={<Pencil size={16} />}
                  className="flex items-center mb-2"
                >
                  Chỉnh sửa
                </Button>
              )}
              {/* <Form.Item
                  label="Ảnh"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  name="avatar"
                >
                  <Upload action="/upload.do" listType="picture-card">
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Tải lên</div>
                    </div>
                  </Upload>
                </Form.Item> */}
              <Form.Item name="imageUrl" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="status" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true }]}
                label="Tên sản phẩm"
              >
                <Input readOnly={isDisabled} />
              </Form.Item>
              <Form.Item
                name="description"
                rules={[{ required: true }]}
                label="Mô tả"
              >
                <TextArea readOnly={isDisabled} />
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
                <InputNumber className="w-full" readOnly={isDisabled} />
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
                    <InputNumber readOnly={isDisabled} className="w-full" />
                  </Form.Item>
                  <Form.Item
                    name="supplier"
                    label="Nhà cung cấp"
                    rules={[{ required: true }]}
                  >
                    <Input readOnly={isDisabled}/>
                  </Form.Item>
                </>
              )}
              <Form.Item initialValue={1} name="quantity" hidden>
                <Input readOnly={isDisabled} />
              </Form.Item>
              <Form.Item
                initialValue="SERVICE"
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
              <Form.Item
                rules={[{ required: true }]}
                name="status"
                label="Trạng thái"
              >
                <Select
                  disabled={isDisabled}
                  options={Object.keys(PRODUCT_STATUS).map((k) => ({
                    value: k,
                    label: PRODUCT_STATUS[k],
                  }))}
                />
              </Form.Item>
              {productType === "PRODUCT" && (
                <Form.Item
                  initialValue={PRODUCT_CATEGORY.SKINCARE}
                  rules={[{ required: true }]}
                  name="category"
                  label="Dòng sản phẩm"
                >
                  <Select
                    disabled={isDisabled}
                    options={Object.keys(PRODUCT_CATEGORY).map((k) => ({
                      value: k,
                      label: PRODUCT_CATEGORY[k],
                    }))}
                  />
                </Form.Item>
              )}
              {!isDisabled && (
                <div className="flex gap-2 justify-end items-center w-full">
                  <Button onClick={handleOnCancelEdit} danger>
                    Hủy
                  </Button>
                  <Button type="primary" onClick={handleOnProductEdit}>
                    Cập nhật
                    {loading && (
                      <Spin
                        indicator={
                          <LoadingOutlined
                            className="ml-2 text-white"
                            style={{ fontSize: 18 }}
                            spin
                          />
                        }
                      />
                    )}
                  </Button>
                </div>
              )}
            </Form>
          </Col>
        </Row>
      ),
    },
    {
      key: "advanced",
      label: (
        <span className="flex items-center text-red-400">
          <Settings />
          Nâng cao
        </span>
      ),
      children: (
        <Row>
          <Col span={8}>Xóa {PRODUCT_TYPE[productType]}</Col>
          <Col span={16} className="flex items-center">
            <Popconfirm
              title={`Xóa ${PRODUCT_TYPE[productType]}`}
              description={`Bạn có chắc chắn xóa ${PRODUCT_TYPE[productType]} này`}
              onConfirm={handleDeleteProduct}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button danger>Xóa</Button>
            </Popconfirm>
          </Col>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    if (form && modalOpen && product) {
      form.setFieldsValue({
        ...product,
      });
      setImageUrl(product?.imageUrl || "");
    }
    if (!product) {
      setModalOpen(false);
    }
  }, [product, modalOpen]);

  return (
    <Modal
      title={`Thông tin ${PRODUCT_TYPE[productType]}`}
      centered
      open={modalOpen}
      onCancel={handleOnCancel}
      width={700}
      cancelText="Đóng"
      footer={<></>}
    >
      {contextHolder}
      <Tabs defaultActiveKey="staff" items={tabsMenu} />
    </Modal>
  );
}
