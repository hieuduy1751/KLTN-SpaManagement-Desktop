import { useEffect, useState } from "react";
import { WeeklyCalendar } from "../../components/WeeklyCalendar";
import { GenericEvent } from "../../components/WeeklyCalendar/types";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getAppointments, setSelectedAppointmentById } from "../../store/slices/appointmentSlice";
import { PaginationType } from "../../types/generalTypes";
import { AppointmentType } from "../../types/appointment";
import dayjs from "dayjs";
import AppointmentDetail from "../../components/AppointmentDetail";

export default function AppointmentCalendarPage() {
  const data = useAppSelector((state) => state.appointments.appointments);
  const dispatch = useAppDispatch();
  const [events, setEvents] = useState<GenericEvent[]>([]);
  const [appointmentDetailModalOpen, setAppointmentDetailModalOpen] =
    useState<boolean>(false);
  const tableParams: PaginationType = useAppSelector(
    (state) => state.appointments.pagination
  );
  const fetchData = (params: PaginationType) => {
    try {
      dispatch(
        getAppointments({
          pagination: params,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleAppointmentSelected = (event: any) => {
    dispatch(setSelectedAppointmentById(event.eventId));
    setAppointmentDetailModalOpen(true);
  };

  useEffect(() => {
    fetchData(tableParams);
  }, []);

  useEffect(() => {
    if (data) {
      const e: GenericEvent[] = data.map(
        (d: AppointmentType, index: number) => {
          return {
            eventId: d.id || index.toString(),
            startTime: dayjs(d.time).subtract(7, "hours").toDate(),
            endTime: dayjs(d.time).subtract(6, "hours").toDate(),
            title: `Cuộc hẹn với ${d.reference?.customerName}`,
            backgroundColor: d.status === 'WAITING' ? 'orange' : d.status === 'IN_PROGRESS' ? 'cyan' : d.status === 'FINISHED' ? 'green' : 'red'
          };
        }
      );
      setEvents(e);
    }
  }, [data]);

  return (
    <div className="w-full h-[85vh]">
      <AppointmentDetail
        modalOpen={appointmentDetailModalOpen}
        setModalOpen={setAppointmentDetailModalOpen}
      />
      <WeeklyCalendar
        events={events}
        onEventClick={handleAppointmentSelected}
        onSelectDate={(date) => console.log(date)}
        weekends
      />
    </div>
  );
}
