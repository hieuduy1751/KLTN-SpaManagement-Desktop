import { Bell, User2 } from "lucide-react";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { doLogout } from "../store/slices/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const userEmail = useAppSelector((state) => state.user.user?.email);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [active, setActive] = React.useState<string>("/");

  const menu = [
    {
      title: "Accounts",
      icon: <User2 />,
      path: "/home/accounts",
      key: "accounts",
    },
    {
      title: "Notifications",
      icon: <Bell />,
      path: "/home/notifications",
      key: "notifications",
    },
  ];

  const handleLogout = () => {
    dispatch(doLogout())
      .then(() => navigate("/auth/login"))
      .catch((err) => console.log(err));
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  return (
    <div className="w-full h-[100vh] flex flex-col justify-between px-3">
      <div className="flex flex-col gap-4 mt-4">
        {menu.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-4 p-2 rounded-md cursor-pointer hover:bg-gray-300 ${
              active === item.path && "bg-gray-500 text-white font-bold"
            }`}
            onClick={() => handleNavigate(item.path)}
          >
            {item.icon}
            <span>{item.title}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="gap-4 p-2 mb-3 rounded-md text-center">
          <span className="text-blue-500 font-bold">{userEmail}</span>
        </div>
        <div className="gap-4 p-2 mb-3 rounded-md text-center cursor-pointer hover:bg-gray-300">
          <span onClick={handleLogout} className="text-red-500 font-bold">
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
