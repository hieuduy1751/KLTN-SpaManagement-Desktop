import { notification, Form, Modal, Button } from "antd";
import { useState } from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import CustomerSearchInput from "./SearchInput/CustomerSearchInput";
import ServiceSearchInput from "./SearchInput/ServiceSearchInput";
import TextArea from "antd/es/input/TextArea";
import { TreatmentType } from "../types/treatment";
import { addTreatment } from "../store/slices/treatmentSlice";
import EmployeeSearchInput from "./SearchInput/EmployeeSearchInput";
import { UserPlus2 } from "lucide-react";
import CreateCustomer from "./CreateCustomer";

type NotificationType = "success" | "info" | "warning" | "error";

export type CreateTreatmentProps = {
  modalOpen: boolean;
  setModalOpen: any;
  type: string
};

export default function CreateTreatment({
  modalOpen,
  setModalOpen,
  type = 'TREATMENT'
}: CreateTreatmentProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [idCustomer, setIdCustomer] = useState<number | null>();
  const [idProduct, setIdProduct] = useState<number | null>();
  const [idEmployee, setIdEmployee] = useState<number | null>();
  const [createCustomerModalOpen, setCreateCustomerModalOpen] =
    useState<boolean>(false);

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
    const newTreatment: TreatmentType = {
      ...values,
      status: "NEW",
    };
    setLoading(true);
    try {
      await dispatch(addTreatment(newTreatment));
      setLoading(false);
      setModalOpen(false);
      openNotificationWithIcon(
        "success",
        "Thành công",
        `Tạo ${type === 'TREATMENT' ? 'liệu trình' : 'Liệu trình'} thành công!`
      );
      form.resetFields();
    } catch (err: any) {
      openNotificationWithIcon("error", "Thất bại", err.message);
    }
  };

  return (
    <Modal
      title={`Tạo ${type === 'TREATMENT' ? 'liệu trình' : 'Liệu trình'} mới`}
      centered
      open={modalOpen}
      onOk={handleOnCreate}
      onCancel={handleOnCancel}
      confirmLoading={loading}
      width={500}
      okText={`Tạo ${type === 'TREATMENT' ? 'liệu trình' : 'Liệu trình'}`}
      cancelText="Hủy bỏ"
    >
      <CreateCustomer
        modalOpen={createCustomerModalOpen}
        setModalOpen={setCreateCustomerModalOpen}
      />
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
          name="idCustomer"
          rules={[{ required: true }]}
          label="Khách hàng"
        >
          <CustomerSearchInput
            value={idCustomer}
            onChange={setIdCustomer}
            placeholder="Chọn khách hàng"
          />
        </Form.Item>
        <div className="flex justify-end mb-3">
          <Button
            onClick={() => setCreateCustomerModalOpen(true)}
            htmlType="button"
            type="primary"
            icon={<UserPlus2 />}
            className="flex items-center"
          >
            Thêm khách hàng
          </Button>
        </div>
        <Form.Item
          name="idEmployee"
          rules={[{ required: true }]}
          label="Nhân viên"
        >
          <EmployeeSearchInput
            value={idEmployee}
            onChange={setIdEmployee}
            placeholder="Chọn nhân viên"
          />
        </Form.Item>
        <Form.Item
          name="idProduct"
          rules={[{ required: true }]}
          label={`${type === 'TREATMENT' ? 'liệu trình' : 'Liệu trình'}`}
        >
          <ServiceSearchInput
            value={idProduct}
            onChange={setIdProduct}
            placeholder={`Chọn ${type === 'TREATMENT' ? 'liệu trình' : 'Liệu trình'}`}
          />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <TextArea placeholder="Thêm ghi chú" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
