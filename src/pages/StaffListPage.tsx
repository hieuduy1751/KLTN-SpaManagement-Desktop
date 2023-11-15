import { Button, Input, Space, Table } from "antd";
import { SearchProps } from "antd/es/input";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationType } from "../types/generalTypes";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { StaffType } from "../types/staff";
import {
  getStaffs,
  setSelectedStaff,
  setStaffs,
} from "../store/slices/staffSlice";
import CreateStaff from "../components/CreateStaff";
import StaffDetail from "../components/StaffDetail";
import POSITION from "../constants/position";

export default function StaffListPage() {
  const [createStaffModalOpen, setCreateStaffModalOpen] =
    useState<boolean>(false);
  const [staffDetailModalOpen, setStaffDetailModalOpen] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.staffs.staffs);
  const loading = useAppSelector((state) => state.staffs.loading);
  const tableParams: PaginationType = useAppSelector(
    (state) => state.staffs.pagination
  );
  const columns: ColumnsType<StaffType> = [
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
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      render: (text) => POSITION[text] || '',
      sorter: (a, b) => a.firstName.charCodeAt(0) - b.firstName.charCodeAt(0),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      sorter: (a, b) => a.address.charCodeAt(0) - b.address.charCodeAt(0),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <a href={"tel:" + text}>{text}</a>,
      sorter: (a, b) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        a.phone?.charCodeAt(1) - b.phone?.charCodeAt(1),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a href={"mailto:" + text}>{text}</a>,
      sorter: (a, b) => a.email.charCodeAt(0) - b.email.charCodeAt(0),
    },
    {
      title: "Lương",
      key: "salaryGross",
      dataIndex: "salaryGross",
      sorter: (a, b) => a.salaryGross - b.salaryGross,
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleStaffSelected(record)} type="primary">
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  const handleStaffSelected = (staff: StaffType) => {
    dispatch(setSelectedStaff(staff));
    setStaffDetailModalOpen(true);
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const fetchData = (params: PaginationType) => {
    try {
      dispatch(getStaffs(params));
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
      dispatch(setStaffs([]));
    }
  };

  useEffect(() => {
    fetchData(tableParams);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex items-center mb-3">
        <Input.Search
          placeholder="Tìm kiếm nhân viên"
          allowClear
          onSearch={onSearch}
          className="w-72"
        />
        <Button
          onClick={() => setCreateStaffModalOpen(true)}
          className="ml-3 flex items-center"
          icon={<UserPlus2 />}
        >
          Thêm nhân viên
        </Button>
      </div>
      <CreateStaff
        modalOpen={createStaffModalOpen}
        setModalOpen={setCreateStaffModalOpen}
      />
      <StaffDetail
        modalOpen={staffDetailModalOpen}
        setModalOpen={setStaffDetailModalOpen}
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
