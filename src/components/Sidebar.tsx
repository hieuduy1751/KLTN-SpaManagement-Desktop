import {
  ArrowLeftRight,
  BadgePlus,
  Box,
  CalendarDays,
  FileText,
  Gauge,
  Package,
  Package2,
  Receipt,
  UserSquare,
  Users2,
} from "lucide-react";
import React from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import { useNavigate } from "react-router-dom";
import { Menu, type MenuProps } from "antd";
import spaLogo from "../assets/spa_logo.png";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items: MenuItem[] = [
    getItem("Bảng thông tin", "dashboard", <Gauge />),
    // getItem("Quản lý đặt Liệu trình", "served-service", <Box />),
    getItem("Theo dõi liệu trình", "treatment-detail", <BadgePlus />),
    getItem("Cuộc hẹn", "calendar", <CalendarDays />),
    getItem("Liệu trình", "service-list", <Box />),
    getItem("Sản phẩm", "goods", <Package2 />),
    getItem("Hóa đơn", "invoice", <Receipt />),
    getItem(
      "Khách hàng",
      "customer",
      null,
      [
        getItem("Danh sách khách hàng", "customer-list", <Users2 />),
        // getItem("Chăm sóc khách hàng", "customer-service", <MessagesSquare />),
      ],
      "group"
    ),
    getItem(
      "Nhân viên",
      "staff",
      null,
      [getItem("Danh sách nhân viên", "staff-list", <UserSquare />)],
      "group"
    ),
    // getItem(
    //   "Kế toán",
    //   "finance",
    //   null,
    //   [
    //     getItem("Thu", "income", <ArrowRight color="green" />),
    //     getItem("Chi", "pay", <ArrowLeft color="red" />),
    //   ],
    //   "group"
    // ),
    getItem(
      "Thống kê/Báo cáo",
      "reports",
      null,
      [
        getItem("Lợi nhuận", "revenue", <ArrowLeftRight />),
        getItem("Top khách hàng", "top-customer", <Users2 />),
        getItem("Top Liệu trình", "top-service", <Package />),
      ],
      "group"
    ),
    getItem(
      "Tin tức/sự kiện",
      "news-events",
      null,
      [
        getItem("Bài đăng mới", "new-post", <FileText />),
        // getItem("Sự kiện sắp tới", "incoming-event", <CalendarClock />),
      ],
      "group"
    ),
  ];

  const handleNavigate = ({ key }) => {
    switch (key) {
      case "dashboard":
        navigate("/home/dashboard");
        break;
      case "treatment-detail":
        navigate("/home/treatments");
        break;
      case "calendar":
        navigate("/home/calendar");
        break;
      case "customer-list":
        navigate("/home/customers");
        break;
      case "goods":
        navigate("/home/goods");
        break;
      case "invoice":
        navigate("/home/invoice");
        break;
      case "customer-service":
        navigate("/home/customer-service");
        break;
      case "staff-list":
        navigate("/home/staffs");
        break;
      case "income":
        navigate("/home/finance/income");
        break;
      case "pay":
        navigate("/home/finance/pay");
        break;
      case "income-pay":
        navigate("/home/reports/income-pay");
        break;
      case "service":
        navigate("/home/reports/services");
        break;
      case "new-post":
        navigate("/home/posts/new-post");
        break;
      case "incoming-event":
        navigate("/home/posts/incoming-event");
        break;
      case "service-list":
        navigate("/home/service-list");
        break;
      case "top-customer":
        navigate("/home/top-customer");
        break;
      case "served-service":
        navigate("/home/served-service");
        break;

      default:
        break;
    }
  };

  return (
    <div className="w-full h-[100vh] flex flex-col justify-between px-3">
      <div className="flex justify-center items-center">
        <img src={spaLogo} alt="logo" className="w-24" />
      </div>
      <div className="flex flex-col gap-4 mt-4 overflow-auto">
        <Menu
          mode="inline"
          items={items}
          onClick={handleNavigate}
          className="rounded-xl"
          defaultSelectedKeys={["dashboard"]}
        />
      </div>
      <div>
        <div className="gap-4 p-2 mb-3 rounded-md text-center cursor-pointer hover:bg-gray-300"></div>
      </div>
    </div>
  );
}
