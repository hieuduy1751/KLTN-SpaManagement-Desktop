import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Tabs,
  Typography,
  Upload,
  UploadProps,
  message,
  notification,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { BookImage, CalendarDays, Pencil, Receipt } from "lucide-react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { TreatmentType } from "../types/treatment";
import { editTreatment } from "../store/slices/treatmentSlice";
import TREATMENT_STATUS from "../constants/treatment-status";
import {
  beforeUploadImg,
  getBase64,
  uploadImageService,
} from "../services/image";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import INVOICE_STATUS from "../constants/invoice-status";
import ProductInInvoiceDetail from "./ProductInInvoiceDetail";
import dayjs from "dayjs";
import { updateInvoice } from "../services/invoice";

export type TreatmentDetailProps = {
  modalOpen: boolean;
  setModalOpen: any;
};

export default function TreatmentDetail({
  modalOpen,
  setModalOpen,
}: TreatmentDetailProps) {
  const [form] = Form.useForm();
  const [invoiceForm] = Form.useForm();
  const dispatch = useAppDispatch();
  const treatment = useAppSelector(
    (state) => state.treatments.selectedTreatment
  );
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [loadingIMGBefore, setLoadingIMGBefore] = useState(false);
  const [imageBeforeUrl, setImageBeforeUrl] = useState<string>();
  const [loadingIMGCurrent, setLoadingIMGCurrent] = useState(false);
  const [imageCurrentUrl, setImageCurrentUrl] = useState<string>();
  const [loadingIMGAfter, setLoadingIMGAfter] = useState(false);
  const [imageResultUrl, setimageResultUrl] = useState<string>();
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

  const handleOnTreatmentEdit = async () => {
    const formValues = form.getFieldsValue();
    const payload: TreatmentType = {
      idCustomer: treatment?.customerResponse?.id || "",
      idProduct: treatment?.productResponse?.id || "",
      ...treatment,
      ...formValues,
      note: formValues.note,
      status: formValues.status,
    };
    try {
      await dispatch(
        editTreatment({
          treatment: payload,
        })
      );
      api.success({
        message: "Thành công",
        description: `Cập nhật liệu trình thành công!`,
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
      ...treatment,
      customer:
        treatment?.customerResponse?.lastName +
        " " +
        treatment?.customerResponse?.firstName,
      product: treatment?.productResponse?.name,
    });
  };

  const handleChangeBefore: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoadingIMGBefore(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoadingIMGBefore(false);
        setImageBeforeUrl(url);
      });
    }
  };

  const handleChangeCurrent: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoadingIMGCurrent(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoadingIMGCurrent(false);
        setImageCurrentUrl(url);
      });
    }
  };

  const handleChangeAfter: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoadingIMGAfter(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoadingIMGAfter(false);
        setimageResultUrl(url);
      });
    }
  };

  const uploadButtonBefore = (
    <div>
      {loadingIMGBefore ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const uploadButtonCurrent = (
    <div>
      {loadingIMGCurrent ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const uploadButtonAfter = (
    <div>
      {loadingIMGAfter ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const uploadImage = async (options, type) => {
    const { onSuccess, onError, file, onProgress } = options;

    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const percent = Math.floor((event.loaded / event.total) * 100);
        if (type === "before") {
          setLoadingIMGBefore(true);
        } else if (type === "current") {
          setLoadingIMGCurrent(true);
        } else if (type === "after") {
          setLoadingIMGAfter(true);
        }
        if (percent === 100) {
          if (type === "before") {
            setLoadingIMGBefore(false);
          } else if (type === "current") {
            setLoadingIMGCurrent(false);
          } else if (type === "after") {
            setLoadingIMGAfter(false);
          }
        }
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    try {
      const res = await uploadImageService(file, config);
      onSuccess("Ok");
      if (type === "before") {
        setImageBeforeUrl(res);
        form.setFieldValue("imageBefore", res);
      } else if (type === "current") {
        setImageCurrentUrl(res);
        form.setFieldValue("imageCurrent", res);
      } else if (type === "after") {
        setimageResultUrl(res);
        form.setFieldValue("imageResult", res);
      }
      await handleOnTreatmentEdit();
    } catch (err) {
      console.log("Eroor: ", err);
      onError({ err });
    }
  };

  const handleBillUpdate = async () => {
    if (treatment?.invoiceResponse) {
      const invoice = treatment.invoiceResponse;
      const note = invoiceForm.getFieldValue("note");
      const status = invoiceForm.getFieldValue("status");
      const payload = {
        dueDate: new Date(),
        note,
        paymentMethod: "CAST",
        status,
      };
      try {
        if (invoice && invoice.id) {
          const res = await updateInvoice(payload, invoice.id);
          if (res.id) {
            api.success({
              message: 'Cập nhật thành công',
            });
            if (status === 'PAID') {
              setIsPaid(true)
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const tabsMenu = [
    {
      key: "treatment",
      label: (
        <span className="flex items-center">
          <CalendarDays />
          Thông tin liệu trình
        </span>
      ),
      children: (
        <Row>
          <Col span={12} className="p-5">
            <Image src={treatment?.productResponse?.imageUrl || ""} />
          </Col>
          <Col span={12} className="p-5">
            <Typography.Text className="text-3xl block">
              {treatment?.productResponse?.name}
            </Typography.Text>
            <Typography.Text className="text-xl block text-red-400 mt-1 mb-3">
              {treatment?.productResponse?.price} VND
            </Typography.Text>
            <Typography.Text className="text-md block text-gray-700">
              {treatment?.productResponse?.description}
            </Typography.Text>
          </Col>
          <Col span={24}>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"
              layout="horizontal"
              className="h-[40vh] overflow-auto px-3"
              form={form}
              validateMessages={validateMessages}
            >
              <Form.Item name="imageBefore" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="imageCurrent" hidden>
                <Input />
              </Form.Item>
              <Form.Item hidden name="imageResult">
                <Input />
              </Form.Item>
              <Form.Item
                name="product"
                rules={[{ required: true }]}
                label="Dịch vụ"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="customer"
                rules={[{ required: true }]}
                label="Khách hàng"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="staff"
                rules={[{ required: true }]}
                label="Nhân viên"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item name="note" label="Ghi chú">
                <TextArea readOnly={isDisabled} placeholder="Thêm ghi chú" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                name="status"
                label="Trạng thái"
              >
                <Select
                  disabled={isDisabled}
                  options={Object.keys(TREATMENT_STATUS).map((k) => ({
                    value: k,
                    label: TREATMENT_STATUS[k],
                  }))}
                />
              </Form.Item>
              {isDisabled && (
                <Button
                  onClick={() => setIsDisabled(false)}
                  icon={<Pencil size={16} />}
                  className="flex items-center mb-2"
                >
                  Chỉnh sửa
                </Button>
              )}
              {!isDisabled && (
                <div className="flex gap-2 justify-end items-center w-full">
                  <Button onClick={handleOnCancelEdit} danger>
                    Hủy
                  </Button>
                  <Button type="primary" onClick={handleOnTreatmentEdit}>
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
      key: "progress",
      label: (
        <span className="flex items-center">
          <BookImage />
          Xem hình ảnh liệu trình
        </span>
      ),
      children: (
        <Row>
          <Col span={8}>
            <Typography.Text>Trước</Typography.Text>
            <Upload
              accept="image/*"
              listType="picture-card"
              className="avatar-uploader text-center"
              showUploadList={false}
              customRequest={(r) => uploadImage(r, "before")}
              beforeUpload={(file) => beforeUploadImg(file, message)}
              onChange={handleChangeBefore}
            >
              {imageBeforeUrl ? (
                <img
                  src={imageBeforeUrl}
                  alt="avatar"
                  style={{ width: "150%" }}
                />
              ) : (
                uploadButtonBefore
              )}
            </Upload>
          </Col>
          <Col span={8}>
            <Typography.Text>Hiện tại</Typography.Text>
            <Upload
              accept="image/*"
              listType="picture-card"
              className="avatar-uploader text-center"
              showUploadList={false}
              customRequest={(r) => uploadImage(r, "current")}
              beforeUpload={(file) => beforeUploadImg(file, message)}
              onChange={handleChangeCurrent}
            >
              {imageCurrentUrl ? (
                <img
                  src={imageCurrentUrl}
                  alt="avatar"
                  style={{ width: "150%" }}
                />
              ) : (
                uploadButtonCurrent
              )}
            </Upload>
          </Col>
          <Col span={8}>
            <Typography.Text>Sau</Typography.Text>
            <Upload
              accept="image/*"
              listType="picture-card"
              className="avatar-uploader text-center"
              showUploadList={false}
              customRequest={(r) => uploadImage(r, "after")}
              beforeUpload={(file) => beforeUploadImg(file, message)}
              onChange={handleChangeAfter}
            >
              {imageResultUrl ? (
                <img
                  src={imageResultUrl}
                  alt="avatar"
                  style={{ width: "150%" }}
                />
              ) : (
                uploadButtonAfter
              )}
            </Upload>
          </Col>
        </Row>
      ),
    },
    {
      key: "bill",
      label: (
        <span className="flex items-center">
          <Receipt />
          Hóa đơn
        </span>
      ),
      children: (
        <Row>
          <Col span={12}>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"
              layout="horizontal"
              className="h-[50vh] overflow-auto px-3"
              form={invoiceForm}
              validateMessages={validateMessages}
            >
              <Form.Item label="Ngày tạo" name="createdDate">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Ngày cập nhật" name="updatedDate">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Hóa đơn số" name="id">
                <Input disabled />
              </Form.Item>
              <Form.Item name="note" label="Ghi chú">
                <TextArea />
              </Form.Item>
              <Form.Item name="totalAmount" label="Tổng tiền">
                <Input disabled />
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                name="status"
                label="Trạng thái"
              >
                <Select
                  disabled={isPaid}
                  options={Object.keys(INVOICE_STATUS).map((k) => ({
                    value: k,
                    label: INVOICE_STATUS[k],
                  }))}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleBillUpdate}>
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={12} className="flex flex-col justify-between">
            <Typography.Text className="font-bold px-3">
              Dịch vụ đã sử dụng
            </Typography.Text>
            <div className="px-3 grow">
              {treatment?.invoiceResponse?.invoiceDetailResponses?.map(
                (invoiceDetail, index) => (
                  <ProductInInvoiceDetail
                    key={index}
                    product={invoiceDetail.productResponse}
                    totalPrice={invoiceDetail.totalPrice}
                    totalQuantity={invoiceDetail.totalQuantity}
                  />
                )
              )}
            </div>
            <Button>Tải hóa đơn</Button>
          </Col>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    if (form && modalOpen && treatment) {
      form.setFieldsValue({
        ...treatment,
        customer:
          treatment.customerResponse?.lastName +
          " " +
          treatment.customerResponse?.firstName,
        product: treatment.productResponse?.name,
        staff:
          treatment.employeeResponse?.lastName +
          " " +
          treatment.employeeResponse?.firstName,
      });

      setImageBeforeUrl(treatment.imageBefore);
      setImageCurrentUrl(treatment.imageCurrent);
      setimageResultUrl(treatment.imageResult);
    }
    if (invoiceForm && modalOpen && treatment) {
      invoiceForm.setFieldsValue({
        ...treatment.invoiceResponse,
        createdDate: dayjs(treatment.invoiceResponse?.createdAt).format(
          "HH:mm DD/MM/YYYY"
        ),
        updatedDate: dayjs(treatment.invoiceResponse?.createdAt).format(
          "HH:mm DD/MM/YYYY"
        ),
        totalAmount:
          treatment.invoiceResponse?.totalAmount?.toLocaleString() + "VND",
      });
      if (treatment.invoiceResponse?.status === 'PAID') {
        setIsPaid(true)
      }
    }
    if (!treatment) {
      setModalOpen(false);
    }
  }, [treatment, modalOpen]);

  return (
    <Modal
      title={`Thông tin liệu trình`}
      centered
      open={modalOpen}
      onCancel={handleOnCancel}
      width={700}
      cancelText="Đóng"
      footer={<></>}
    >
      {contextHolder}
      <Tabs defaultActiveKey="treatment" items={tabsMenu} />
    </Modal>
  );
}
