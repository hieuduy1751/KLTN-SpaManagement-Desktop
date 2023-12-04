import React from "react";
import { ProductType } from "../types/product";
import { Image, Typography } from "antd";

type ProductInInvoiceDetailProps = {
  product: ProductType;
  totalQuantity: number;
  totalPrice: number;
};

export default function ProductInInvoiceDetail({
  product,
  totalQuantity,
  totalPrice,
}: ProductInInvoiceDetailProps) {
  return (
    <div className="flex items-center">
      <div className="w-[40%]">
        <Image src={product.imageUrl} />
      </div>
      <div className="w-[60%] p-3">
        <Typography.Text className="text-xl font-bold block">
          {product.name}
        </Typography.Text>
        <Typography.Text className="text-md block">
          Đơn giá: {product.price.toLocaleString()} VND
        </Typography.Text>
        <Typography.Text className="text-md block">
          Số lượng {totalQuantity}
        </Typography.Text>
        <Typography.Text className="text-md block">
          Tổng: {totalPrice.toLocaleString()} VND
        </Typography.Text>
      </div>
    </div>
  );
}
