import { Button, Input, Space, Table } from "antd";
import { SearchProps } from "antd/es/input";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationType } from "../types/generalTypes";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { ProductType } from "../types/product";
import CreateProduct from "../components/CreateProduct";
import ProductDetail from "../components/ProductDetail";
import PRODUCT_TYPE from "../constants/product-type";
import { getServices, setSelectedService, setServices } from "../store/slices/serviceSlice";

export default function ServiceListPage() {
  const [createProductModalOpen, setCreateProductModalOpen] =
    useState<boolean>(false);
  const [productDetailModalOpen, setProductDetailModalOpen] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.services.services);
  const loading = useAppSelector((state) => state.services.loading);
  const tableParams: PaginationType = useAppSelector(
    (state) => state.services.pagination
  );
  const columns: ColumnsType<ProductType> = [
    {
      title: "Tên Liệu trình",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0),
    },
    {
      title: "Loại",
      dataIndex: "productType",
      key: "productType",
      render: text => PRODUCT_TYPE[text],
      sorter: (a, b) => a.productType.charCodeAt(0) - b.productType.charCodeAt(0),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: text => text === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động',
      sorter: (a, b) => a.status.charCodeAt(0) - b.status.charCodeAt(0),
    },
    {
      title: "Mô tả",
      key: "description",
      dataIndex: "description",
      render: (text) => (text.length > 20 ? text.slice(0, 20) + "..." : text),
    },
    {
      title: "Tùy chọn",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleServiceSelected(record)} type="primary">
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  const handleServiceSelected = (service: ProductType) => {
    dispatch(setSelectedService(service));
    setProductDetailModalOpen(true);
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const fetchData = (params: PaginationType) => {
    try {
      dispatch(getServices({
        pagination: params
      }));
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
      dispatch(setServices([]));
    }
  };

  useEffect(() => {
    fetchData(tableParams);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex items-center mb-3">
        <Input.Search
          placeholder="Tìm kiếm liệu trình & Liệu trình"
          allowClear
          onSearch={onSearch}
          className="w-72"
        />
        <Button
          onClick={() => setCreateProductModalOpen(true)}
          className="ml-3 flex items-center"
          icon={<PackagePlus />}
        >
          Thêm
        </Button>
      </div>
      <CreateProduct
        modalOpen={createProductModalOpen}
        setModalOpen={setCreateProductModalOpen}
        productType="SERVICE"
      />
      <ProductDetail
        modalOpen={productDetailModalOpen}
        setModalOpen={setProductDetailModalOpen}
        productType="SERVICE"
      />
      <Table
        rowKey={(record) => record.id || record.name}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </div>
  );
}
