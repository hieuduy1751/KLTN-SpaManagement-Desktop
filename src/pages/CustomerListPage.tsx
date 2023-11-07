import { Button, Input, Space, Table } from "antd";
import { SearchProps } from "antd/es/input";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationType } from "../types/generalTypes";
import CreateCustomer from "../components/CreateCustomer";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getCustomers, setCustomers, setSelectedCustomer } from "../store/slices/customerSlice";
import { CustomerType } from "../types/customer";
import CustomerDetail from "../components/CustomerDetail";
import CustomerClass from "../components/CustomerClass";

export default function CustomerListPage() {
  const [createCustomerModalOpen, setCreateCustomerModalOpen] =
    useState<boolean>(false);
  const [customerDetailModalOpen, setCustomerDetailModalOpen] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.customers.customers);
  const loading = useAppSelector((state) => state.customers.loading);
  const tableParams: PaginationType = useAppSelector(
    (state) => state.customers.pagination
  );
  const columns: ColumnsType<CustomerType> = [
    {
      title: "Họ",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.charCodeAt(0) - b.lastName.charCodeAt(0),
    },
    {
      title: "Tên",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.charCodeAt(0) - b.firstName.charCodeAt(0),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (text) => text === 'MALE' ? 'Nam' : 'Nữ',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      sorter: (a, b) => a.gender?.charCodeAt(0) - b.gender?.charCodeAt(0), 
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.charCodeAt(0) - b.address.charCodeAt(0),
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => <a href={"tel:" + text}>{text}</a>,
      sorter: (a, b) =>
        a.phoneNumber.charCodeAt(1) - b.phoneNumber.charCodeAt(1),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a href={"mailto:" + text}>{text}</a>,
      sorter: (a, b) => a.email.charCodeAt(0) - b.email.charCodeAt(0),
    },
    {
      title: "Hạng",
      key: "customerClass",
      dataIndex: "customerClass",
      render: (_, { customerClass }) => {
        return <CustomerClass customerClass={customerClass} />;
      },
      filters: [
        {
          text: "Cũ",
          value: "OLD",
        },
        {
          text: "Mới",
          value: "NEW",
        },
        {
          text: "VIP",
          value: "VIP",
        },
        {
          text: "Kim cương",
          value: "DIAMOND",
        },
      ],
      onFilter: (value: any, record) =>
        record.customerClass.indexOf(value) === 0,
      sorter: (a, b) =>
        a.customerClass.charCodeAt(0) - b.customerClass.charCodeAt(0),
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleCustomerSelected(record)} type="primary">
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  const handleCustomerSelected = (customer: CustomerType) => {
    dispatch(setSelectedCustomer(customer));
    setCustomerDetailModalOpen(true);
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const fetchData = (params: PaginationType) => {
    try {
      dispatch(getCustomers(params));
    } catch (err) {
      console.log(err);
    }
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (
      tableParams.pagination.current !== pagination.current ||
      tableParams.pagination.pageSize !== pagination.pageSize
    ) {
      fetchData({
        pagination: {
          current: pagination.current || 1,
          pageSize: pagination.pageSize || 10,
          total: tableParams.pagination.total,
        },
      });
    }

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      dispatch(setCustomers([]));
    }
  };

  useEffect(() => {
    fetchData(tableParams);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex items-center mb-3">
        <Input.Search
          placeholder="Tìm kiếm khách hàng"
          allowClear
          onSearch={onSearch}
          className="w-72"
        />
        <Button
          onClick={() => setCreateCustomerModalOpen(true)}
          className="ml-3 flex items-center"
          icon={<UserPlus2 />}
        >
          Thêm khách hàng
        </Button>
      </div>
      <CreateCustomer
        modalOpen={createCustomerModalOpen}
        setModalOpen={setCreateCustomerModalOpen}
      />
      <CustomerDetail
        modalOpen={customerDetailModalOpen}
        setModalOpen={setCustomerDetailModalOpen}
      />
      <Table
        rowKey={(record) => record.id || record.phoneNumber}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </div>
  );
}
