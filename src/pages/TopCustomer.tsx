import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { CustomerClassEnum } from "../enums/CustomerClass";
import { getTopCustomer } from "../services/statistic";

export default function TopCustomer() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const fetchData = async () => { 
    setLoading(true)
    try {
      const res = await getTopCustomer()
      if (!res.error) {
        setData(res)
      }
      setLoading(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const columns = [
    {
      title: "Mã khách hàng",
      dataIndex: "idCustomer",
      key: "idCustomer",
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "firstName",
      render: (_, record) => record.lastName + " " + record.firstName,
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Hạng",
      dataIndex: "customerClass",
      key: "customerClass",
      render: (text) => CustomerClassEnum[text],
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalSpending",
      key: "totalSpending",
      render: (text) => text.toLocaleString() + ' VND'
    },
  ];
  return (
    <Table
      rowKey={(record) => record.id || record.name}
      loading={loading}
      columns={columns}
      dataSource={data}
    />
  );
}
