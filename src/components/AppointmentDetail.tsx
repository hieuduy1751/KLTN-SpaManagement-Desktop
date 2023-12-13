import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Tabs,
  notification,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { CalendarDays, Pencil } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import APPOINTMENT_STATUS from "../constants/appointment-status";
import dayjs from "dayjs";
import { AppointmentType } from "../types/appointment";
import { editAppointment } from "../store/slices/appointmentSlice";
import { LoadingOutlined } from "@ant-design/icons";
import AppointmentDatePicker from "./AppointmentDatePicker";
import { TreatmentType } from "../types/treatment";
import { addTreatment } from "../store/slices/treatmentSlice";

type NotificationType = "success" | "info" | "warning" | "error";

export type AppointmentDetailProps = {
  modalOpen: boolean;
  setModalOpen: any;
};

export default function AppointmentDetail({
  modalOpen,
  setModalOpen,
}: AppointmentDetailProps) {
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [time, setTime] = useState<any | null>()
  const dispatch = useAppDispatch()
  const appointment = useAppSelector(
    (state) => state.appointments.selectedAppointment
  );
  const [api, contextHolder] = notification.useNotification();
  const handleOnCancel = () => {
    setModalOpen(false);
    if (form) {
      form.resetFields();
    }
  };
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

  const handleOnCancelEdit = () => {
    setIsDisabled(true);
    form.setFieldsValue({
      ...appointment,
      time: dayjs(appointment?.time).subtract(7, 'hours'),
      employee: appointment?.reference?.employeeName,
      customer: appointment?.reference?.customerName,
      product: appointment?.reference?.productName
    });
  };

  const handleCreateTreatment = async () => {
    const payload: TreatmentType = {
      idCustomer: appointment?.reference?.customerId || '',
      idProduct: appointment?.reference?.productId || '',
      idEmployee: appointment?.reference?.employeeId || '',
      status: 'NEW',
      note: `Được tạo từ cuộc hẹn ${appointment?.id}`
    }
    try {
      await dispatch(addTreatment(payload))
      setLoading(false);
      setModalOpen(false);
      openNotificationWithIcon(
        "success",
        "Thành công",
        "Tạo liệu trình thành công!"
      );
      form.resetFields();
    } catch (err: any) {
      openNotificationWithIcon("error", "Thất bại", err.message);
    }
  }

  const handleOnAppointmentEdit = async () => {
    const formValues = form.getFieldsValue();
    const payload: AppointmentType = {
      idCustomer: appointment?.reference?.customerId || '',
      idEmployee: appointment?.reference?.employeeId || '',
      idProduct: appointment?.reference?.productId || '',
      note: formValues.note,
      status: formValues.status,
      time: dayjs(formValues.time).format('YYYY-MM-DD HH:mm:ss')
    };
    try {
      await dispatch(
        editAppointment({
          appointment: payload,
          appointmentId: appointment?.id || ''
        })
      );
      api.success({
        message: "Thành công",
        description: `Cập nhật cuộc hẹn thành công!`,
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

  const tabsMenu = [
    {
      key: "appointment",
      label: (
        <span className="flex items-center">
          <CalendarDays />
          Thông tin cuộc hẹn
        </span>
      ),
      children: (
        <Row>
          <Col span={24}>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              labelAlign="left"
              layout="horizontal"
              className="h-[60vh] overflow-auto px-3"
              form={form}
              validateMessages={validateMessages}
            >
              <Form.Item
                name="employee"
                rules={[{ required: true }]}
                label="Nhân viên"
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
                name="product"
                rules={[{ required: true }]}
                label="Liệu trình"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="time"
                rules={[{ required: true }]}
                label="Thời gian"
              >
                <AppointmentDatePicker disabled={isDisabled
                } value={time} onChange={setTime} placeholder="Chọn thời gian" />
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
                  options={Object.keys(APPOINTMENT_STATUS).map((k) => ({
                    value: k,
                    label: APPOINTMENT_STATUS[k],
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
                  <Button type="primary" onClick={handleOnAppointmentEdit}>
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
              <Button htmlType="button" type="primary" onClick={handleCreateTreatment}>Tạo liệu trình từ cuộc hẹn này</Button>
            </Form>
          </Col>
        </Row>
      ),
    },
  ];

  useEffect(() => {
    if (form && modalOpen && appointment) {
      form.setFieldsValue({
        ...appointment,
        time: dayjs(appointment.time).subtract(7, "hours"),
        employee: appointment.reference?.employeeName,
        customer: appointment.reference?.customerName,
        product: appointment.reference?.productName,
      });
    }
    if (!appointment) {
      setModalOpen(false);
    }
  }, [appointment, modalOpen]);

  return (
    <Modal
      title={`Thông tin cuộc hẹn`}
      centered
      open={modalOpen}
      onCancel={handleOnCancel}
      width={700}
      cancelText="Đóng"
      footer={<></>}
    >
      {contextHolder}
      <Tabs defaultActiveKey="appointment" items={tabsMenu} />
    </Modal>
  );
}
