import { Button, Space, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { RotateCw, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { useEffect, useState } from "react";
import { UserData, setUsers } from "../store/slices/usersSlice";
type UserDataType = {
  key: string;
  username: string;
  userId: string;
};

export default function AccountsPage() {
  const users = useAppSelector((state) => state.users.users);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const columns: ColumnsType<UserDataType> = [
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
      render: (text) => text.slice(0, 8),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Send notification">
            <Button
              type="primary"
              onClick={() => handleSendNotificationClick(record)}
            >
              <Send size={16} />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleSendNotificationClick = (record: UserData) => {
    setSelectedUser(record);
    setModalOpen(true);
  };

  const handleRefreshClick = () => {
    // dispatch(setUsers());
  }

  useEffect(() => {
    // dispatch(setUsers());
  }, []);

  return (
    <div className="w-full h-full py-3">
      <Button
        type="primary"
        shape="circle"
        icon={<RotateCw />}
        size="large"
        onClick={handleRefreshClick}
        className="m-3"
      />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <Table columns={columns} dataSource={users} rowKey={(u) => u.username} />
    </div>
  );
}
