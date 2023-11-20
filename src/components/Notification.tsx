import React from "react";
import { Button, notification, Space } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

export default function Notification() {
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: "Notification Title",
      description:
        "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
    });
  };
}
