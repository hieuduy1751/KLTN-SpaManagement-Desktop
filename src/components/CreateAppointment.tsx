import {
  notification,
  Form,
  Modal,
} from "antd";
import { useState } from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import { AppointmentType } from "../types/appointment";
import { addAppointment } from "../store/slices/appointmentSlice";
import EmployeeSearchInput from "./SearchInput/EmployeeSearchInput";
import AppointmentDatePicker from "./AppointmentDatePicker";
import CustomerSearchInput from "./SearchInput/CustomerSearchInput";
import ServiceSearchInput from "./SearchInput/ServiceSearchInput";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

type NotificationType = "success" | "info" | "warning" | "error";

export type CreateAppointmentProps = {
  modalOpen: boolean;
  setModalOpen: any;
};


export default function CreateAppointment({
  modalOpen,
  setModalOpen,
}: CreateAppointmentProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [idEmployee, setIdEmployee] = useState<number | null>()
  const [idCustomer, setIdCustomer] = useState<number | null>()
  const [idProduct, setIdProduct] = useState<number | null>()
  const [time, setTime] = useState<any | null>()


  const [api, contextHolder] = notification.useNotification();

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
    const newAppointment: AppointmentType = {
      ...values,
      time: dayjs(values.time).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss')
    };
    setLoading(true);
    try {
      await dispatch(addAppointment(newAppointment));
      setLoading(false);
      setModalOpen(false);
      openNotificationWithIcon(
        "success",
        "Thành công",
        "Tạo cuộc hẹn thành công!"
      );
      form.resetFields();
    } catch (err: any) {
      openNotificationWithIcon("error", "Thất bại", err.message);
    }
  };

  return (
    <Modal
      title="Tạo cuộc hẹn mới"
      centered
      open={modalOpen}
      onOk={handleOnCreate}
      onCancel={handleOnCancel}
      confirmLoading={loading}
      width={500}
      okText="Tạo cuộc hẹn"
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
        <Form.Item name="idEmployee" rules={[{ required: true }]} label="Nhân viên">
          <EmployeeSearchInput value={idEmployee} onChange={setIdEmployee} placeholder="Chọn nhân viên" />
        </Form.Item>
        <Form.Item name="idCustomer" rules={[{ required: true }]} label="Khách hàng">
          <CustomerSearchInput value={idCustomer} onChange={setIdCustomer} placeholder="Chọn khách hàng" />
        </Form.Item>
        <Form.Item name="idProduct" rules={[{ required: true }]} label="Liệu trình">
          <ServiceSearchInput value={idProduct} onChange={setIdProduct} placeholder="Chọn Liệu trình" />
        </Form.Item>
        <Form.Item name="time" rules={[{ required: true }]} label="Thời gian">
          <AppointmentDatePicker disabled={false} value={time} onChange={setTime} placeholder="Chọn ngày giờ" />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <TextArea placeholder="Thêm ghi chú" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
