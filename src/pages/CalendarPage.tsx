import { Tabs, TabsProps } from "antd";
import AppointmentCalendarPage from "./Appointments/AppointmentCalendarPage";
import AppointmentListPage from "./Appointments/AppointmentListPage";

export default function CalendarPage() {
  const onChange = (key: string) => {
    console.log(key);
  };
  
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Lịch hẹn',
      children: <AppointmentCalendarPage />
    },
    {
      key: '2',
      label: 'Quản lý cuộc hẹn',
      children: <AppointmentListPage />
    },
  ];

  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

}
