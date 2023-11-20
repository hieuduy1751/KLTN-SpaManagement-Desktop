import { Tag } from "antd";
import { CustomerClassEnum } from "../enums/CustomerClass";

export default function CustomerClass({
  customerClass,
}: {
  customerClass: string;
}) {
  switch (customerClass) {
    case "NEW":
      return <Tag color="orange">{CustomerClassEnum.NEW}</Tag>;
    case "OLD":
      return <Tag>{CustomerClassEnum.OLD}</Tag>;
    case "VIP":
      return <Tag color="gold">{CustomerClassEnum.VIP}</Tag>;
    case "DIAMOND":
      return <Tag color="cyan">{CustomerClassEnum.DIAMOND}</Tag>;

    default:
      break;
  }
}
