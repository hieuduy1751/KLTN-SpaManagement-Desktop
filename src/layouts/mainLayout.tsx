import { Breadcrumb } from "antd";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import PATH from "../constants/path";

export default function MainLayout() {
  const location = useLocation();
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    if (location.pathname !== "/") {
      const paths = location.pathname.split("/");
      const newItems: any = [];
      paths.forEach((path: string) => {
        newItems.push({
          href: "",
          title: PATH.find((p) => p.path === path)?.name,
        });
      });
      setItems(newItems);
    }
  }, [location.pathname]);

  return (
    <div className="w-full h-[100vh] flex">
      <div className="w-[20%] h-full bg-gray-200">
        <Sidebar />
      </div>
      <div className="w-[80%] h-[100vh]">
        <div className="flex items-center p-5 shadow">
          <Breadcrumb
            items={[
              {
                href: "",
                title: <HomeOutlined />,
              },
              ...items,
            ]}
          />
        </div>
        <div className="p-5 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
