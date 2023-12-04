import { Button, Input, Space, Table } from "antd";
import { SearchProps } from "antd/es/input";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationType } from "../types/generalTypes";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { InvoiceType } from "../types/invoice";
import {
  getInvoices,
  setInvoices,
  setSelectedInvoice,
} from "../store/slices/invoicesSlice";
import InvoiceDetail from "../components/InvoiceDetail";
import dayjs from "dayjs";
import INVOICE_STATUS from "../constants/invoice-status";

export default function InvoicePage() {
  const [invoiceDetailModalOpen, setInvoiceDetailModalOpen] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.invoices.invoices);
  const loading = useAppSelector((state) => state.invoices.loading);
  const tableParams: PaginationType = useAppSelector(
    (state) => state.invoices.pagination
  );
  const columns: ColumnsType<InvoiceType> = [
    {
      title: "Hóa đơn số",
      dataIndex: "id",
      key: "id",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Khách hàng",
      dataIndex: "customerResponse",
      key: "customerResponse",
      render: (text) => text.lastName + " " + text.firstName,
      sorter: (a, b) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        a.customerResponse.firstName.charCodeAt(0) -
        b.customerResponse.firstName.charCodeAt(0),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => dayjs(text).format("HH:mm DD/MM/YYYY"),
      sorter: (a, b) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        a.createdDate.charCodeAt(0) - b.createdDate.charCodeAt(0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => INVOICE_STATUS[text],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      sorter: (a, b) => a.status.charCodeAt(0) - b.status.charCodeAt(0),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "updatedDate",
      key: "updatedDate",
      render: (text, record) =>
        record.status === "PAID" ? dayjs(text).format("HH:mm DD/MM/YYYY") : "",
      sorter: (a, b) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        a.updatedDate.charCodeAt(0) - b.updatedDate.charCodeAt(0),
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleInvoiceSelected(record)} type="primary">
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  const handleInvoiceSelected = (invoice: InvoiceType) => {
    dispatch(setSelectedInvoice(invoice));
    setInvoiceDetailModalOpen(true);
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const fetchData = (params: PaginationType) => {
    try {
      dispatch(
        getInvoices({
          pagination: params,
        })
      );
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
      dispatch(setInvoices([]));
    }
  };

  useEffect(() => {
    fetchData(tableParams);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex items-center mb-3">
        <Input.Search
          placeholder="Tìm kiếm hóa đơn"
          allowClear
          onSearch={onSearch}
          className="w-72"
        />
      </div>
      <InvoiceDetail
        modalOpen={invoiceDetailModalOpen}
        setModalOpen={setInvoiceDetailModalOpen}
      />
      <Table
        rowKey={(record) => record.id || record.dueDate}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </div>
  );
}
