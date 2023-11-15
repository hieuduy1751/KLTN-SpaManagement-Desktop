import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  notification,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Upload,
  InputNumber,
  Select,
  message,
  UploadProps,
  UploadFile,
} from "antd";
import { useState } from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import { StaffType } from "../types/staff";
import { addStaff } from "../store/slices/staffSlice";
import POSITION from "../constants/position";
import {
  beforeUploadImg,
  getBase64,
  uploadImageService,
} from "../services/image";
import { RcFile, UploadChangeParam } from "antd/es/upload";

type NotificationType = "success" | "info" | "warning" | "error";

export type CreateStaffProps = {
  modalOpen: boolean;
  setModalOpen: any;
};

const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function CreateStaff({
  modalOpen,
  setModalOpen,
}: CreateStaffProps) {
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
    const newStaff: StaffType = {
      ...values,
    };
    setLoading(true);
    try {
      await dispatch(addStaff(newStaff));
      setLoading(false);
      setModalOpen(false);
      openNotificationWithIcon(
        "success",
        "Thành công",
        "Thêm nhân viên thành công!"
      );
      form.resetFields()
      setImageUrl('')
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
      form.setFieldValue("avatarUrl", res);
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
      title="Tạo nhân viên mới"
      centered
      open={modalOpen}
      onOk={handleOnCreate}
      onCancel={handleOnCancel}
      confirmLoading={loading}
      width={500}
      okText="Tạo nhân viên"
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
        <Form.Item name="avatarUrl" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" rules={[{ required: true }]} label="Họ">
          <Input />
        </Form.Item>
        <Form.Item name="firstName" rules={[{ required: true }]} label="Tên">
          <Input />
        </Form.Item>
        <Form.Item
          name="salaryGross"
          rules={[
            { required: true },
            {
              pattern: /^[0-9]{1,10}$/,
              message: "Lương phải là số",
            },
          ]}
          label="Lương"
        >
          <InputNumber className="w-full" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true }, { type: "email" }]}
          label="Email"
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          rules={[
            { required: true },
            {
              pattern: /^(03|05|07|08|09)[0-9]{8}$/,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
          label="Số điện thoại"
        >
          <Input />
        </Form.Item>
        <Form.Item rules={[{ required: true }]} name="gender" label="Giới tính">
          <Radio.Group>
            <Radio value="MALE"> Nam </Radio>
            <Radio value="FEMALE"> Nữ </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item rules={[{ required: true }]} name="position" label="Chức vụ">
          <Select
            // onChange={handleChange}
            options={Object.keys(POSITION).map((k) => ({
              value: k,
              label: POSITION[k],
            }))}
          />
        </Form.Item>
        <Form.Item name="address" rules={[{ required: true }]} label="Địa chỉ">
          <Input />
        </Form.Item>
        <Form.Item
          name="birthDay"
          rules={[{ required: true }]}
          label="Ngày sinh"
        >
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item label="Ghi chú">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
