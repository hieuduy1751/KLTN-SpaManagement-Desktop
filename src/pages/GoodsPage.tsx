import { Button, Input, Space, Table } from "antd";
import { SearchProps } from "antd/es/input";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationType } from "../types/generalTypes";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { ProductType } from "../types/product";
import CreateProduct from "../components/CreateProduct";
import ProductDetail from "../components/ProductDetail";
import { getProducts, setProducts, setSelectedProduct } from "../store/slices/productSlice";
import PRODUCT_CATEGORY from "../constants/product-cateogry";

export default function GoodsPage() {
  const [createProductModalOpen, setCreateProductModalOpen] =
    useState<boolean>(false);
  const [productDetailModalOpen, setProductDetailModalOpen] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.products.products);
  const loading = useAppSelector((state) => state.products.loading);
  const tableParams: PaginationType = useAppSelector(
    (state) => state.products.pagination
  );
  const columns: ColumnsType<ProductType> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0),
    },
    {
      title: "Loại",
      dataIndex: "category",
      key: "category",
      render: text => PRODUCT_CATEGORY[text],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sorter: (a, b) => a.category?.charCodeAt(0) - b.category.charCodeAt(0),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
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
          <Button onClick={() => handleProductSelected(record)} type="primary">
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  const handleProductSelected = (product: ProductType) => {
    dispatch(setSelectedProduct(product));
    setProductDetailModalOpen(true);
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  const fetchData = (params: PaginationType) => {
    try {
      dispatch(getProducts({
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
      dispatch(setProducts([]));
    }
  };

  useEffect(() => {
    fetchData(tableParams);
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex items-center mb-3">
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          allowClear
          onSearch={onSearch}
          className="w-72"
        />
        <Button
          onClick={() => setCreateProductModalOpen(true)}
          className="ml-3 flex items-center"
          icon={<UserPlus2 />}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <CreateProduct
        modalOpen={createProductModalOpen}
        setModalOpen={setCreateProductModalOpen}
        productType="PRODUCT"
      />
      <ProductDetail
        modalOpen={productDetailModalOpen}
        setModalOpen={setProductDetailModalOpen}
        productType="PRODUCT"
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
