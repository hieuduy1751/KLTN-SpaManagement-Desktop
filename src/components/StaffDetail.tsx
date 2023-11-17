import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Spin,
  Tabs,
  Tag,
  Typography,
  Upload,
  message,
  notification,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { KeyRound, Pencil, Settings, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { editStaff, removeStaff } from "../store/slices/staffSlice";
import dayjs from "dayjs";
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
import POSITION from "../constants/position";
import { createStaffAccount } from "../services/staff";

export type StaffDetailProps = {
  modalOpen: boolean;
  setModalOpen: any;
};

export default function StaffDetail({
  modalOpen,
  setModalOpen,
}: StaffDetailProps) {
  const [form, accountForm] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingIMG, setLoadingIMG] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const dispatch = useAppDispatch();
  const staff = useAppSelector((state) => state.staffs.selectedStaff);
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

  const handleDeleteStaff = async () => {
    try {
      if (staff?.id) {
        await dispatch(removeStaff(staff?.id));
        api.success({
          message: "Thành công",
          description: "Xóa nhân viên thành công",
        });
      }
    } catch (err: any) {
      api.error({
        message: "Thất bại",
        description: "Xóa nhân viên thất bại",
      });
    }
  };

  const handleOnStaffEdit = async () => {
    const formValues = form.getFieldsValue();
    console.log(formValues);
    try {
      await dispatch(
        editStaff({
          staff: formValues,
          staffId: staff?.id || "",
        })
      );
      api.success({
        message: "Thành công",
        description: "Cập nhật nhân viên thành công!",
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
      ...staff,
      birthDay: dayjs(staff?.birthDay),
    });
    setImageUrl(staff?.avatarUrl || "");
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
      form.setFieldValue("avatarUrl", res);
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

  const handleOnStaffAccountCreate = async (values: any) => {
    if (staff && staff.id) {
      try {
        const res = await createStaffAccount(
          staff?.id,
          values.username,
          values.password,
          values.passwordConfirm
        );
        if (!res.error) {
          message.success("Tạo tài khoản thành công");
        } else {
          message.error(res.message);
        }
      } catch (err: any) {
        message.error(err?.message || "Lỗi không xác định");
      }
    }
  };

  const tabsMenu = [
    {
      key: "staff",
      label: (
        <span className="flex items-center">
          <User />
          Thông tin cá nhân
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
            <Tag>{POSITION[staff?.position || "SECURITY"]}</Tag>
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
              <Form.Item name="avatarUrl" hidden>
                <Input />
              </Form.Item>
              <Form.Item
                name="lastName"
                rules={[{ required: true }]}
                label="Họ"
              >
                <Input readOnly={isDisabled} />
              </Form.Item>
              <Form.Item
                name="firstName"
                rules={[{ required: true }]}
                label="Tên"
              >
                <Input readOnly={isDisabled} />
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
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true }, { type: "email" }]}
                label="Email"
              >
                <Input type="email" readOnly={isDisabled} />
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
                <Input readOnly={isDisabled} />
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                name="gender"
                label="Giới tính"
              >
                <Radio.Group disabled={isDisabled}>
                  <Radio value="MALE"> Nam </Radio>
                  <Radio value="FEMALE"> Nữ </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                name="position"
                label="Chức vụ"
              >
                <Select
                  // onChange={handleChange}
                  disabled={isDisabled}
                  options={Object.keys(POSITION).map((k) => ({
                    value: k,
                    label: POSITION[k],
                  }))}
                />
              </Form.Item>
              <Form.Item
                name="address"
                rules={[{ required: true }]}
                label="Địa chỉ"
              >
                <Input readOnly={isDisabled} />
              </Form.Item>
              <Form.Item
                name="birthDay"
                rules={[{ required: true }]}
                label="Ngày sinh"
              >
                <DatePicker disabled={isDisabled} format="DD/MM/YYYY" />
              </Form.Item>
              <Form.Item label="Ghi chú">
                <TextArea readOnly={isDisabled} rows={4} />
              </Form.Item>
              {!isDisabled && (
                <div className="flex gap-2 justify-end items-center w-full">
                  <Button onClick={handleOnCancelEdit} danger>
                    Hủy
                  </Button>
                  <Button type="primary" onClick={handleOnStaffEdit}>
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
      key: "account",
      label: (
        <span className="flex items-center">
          <KeyRound />
          Tài khoản
        </span>
      ),
      children: (
        <Row>
          <Col span={8}>Tài khoản</Col>
          <Col span={16}>
            <Typography.Text
              className={staff?.username ? "text-blue-500" : "text-red-500"}
            >
              {staff?.username || "Chưa có"}
            </Typography.Text>
          </Col>
          <Divider />
          {!staff?.username && (
            <Col span={16}>
              <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                labelAlign="left"
                layout="horizontal"
                className="px-3"
                form={accountForm}
                validateMessages={validateMessages}
                onFinish={handleOnStaffAccountCreate}
              >
                <Form.Item name="username" label="Tên đăng nhập">
                  <Input />
                </Form.Item>
                <Form.Item name="password" label="Mật khẩu">
                  <Input.Password />
                </Form.Item>
                <Form.Item name="passwordConfirm" label="Nhập lại mật khẩu">
                  <Input.Password />
                </Form.Item>
                <div className="w-full flex justify-end">
                  <Button htmlType="submit" type="primary">
                    Tạo tài khoản
                  </Button>
                </div>
              </Form>
            </Col>
          )}
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
          <Col span={8}>Xóa nhân viên</Col>
          <Col span={16} className="flex items-center">
            <Popconfirm
              title="Xóa nhân viên"
              description="Bạn có chắc chắn xóa nhân viên này"
              onConfirm={handleDeleteStaff}
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
    if (form && modalOpen && staff) {
      form.setFieldsValue({
        ...staff,
        phoneNumber: staff?.phone,
        birthDay: dayjs(staff?.birthDay),
      });
      setImageUrl(staff?.avatarUrl || "");
    }
    if (!staff) {
      setModalOpen(false);
    }
  }, [staff, modalOpen]);

  return (
    <Modal
      title="Thông tin nhân viên"
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
