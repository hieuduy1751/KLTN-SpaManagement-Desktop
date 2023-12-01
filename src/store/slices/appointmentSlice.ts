import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PaginationType } from "../../types/generalTypes";
import { AppointmentType } from "../../types/appointment";
import {
  getAppointments as getA,
  createAppointment,
  deleteAppointment,
  updateAppointment,
} from "../../services/appointment";

export interface AppointmentState {
  loading: boolean;
  appointments: AppointmentType[] | undefined;
  selectedAppointment: AppointmentType | undefined;
  pagination: PaginationType;
}

const initialState: AppointmentState = {
  loading: false,
  appointments: [],
  selectedAppointment: undefined,
  pagination: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 10,
    },
  },
};

export const setAppointments = createAction(
  "appointments/doSetAppointments",
  (appointments: AppointmentType[]) => {
    return {
      payload: appointments,
    };
  }
);

export const getAppointments = createAsyncThunk(
  "appointments/doGetAppointments",
  async ({ pagination }: { pagination: PaginationType }) => {
    const res = await getA(pagination);
    return {
      appointments: res,
      pagination,
    };
  }
);

export const addAppointment = createAsyncThunk(
  "appointments/doCreateAppointment",
  async (appointment: AppointmentType, { dispatch }) => {
    await createAppointment(appointment);
    dispatch(
      getAppointments({
        pagination: {
          pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
          },
        },
      })
    );
  }
);

export const editAppointment = createAsyncThunk(
  "appointments/doEditAppointment",
  async ({
    appointment,
    appointmentId,
  }: {
    appointment: AppointmentType;
    appointmentId: string;
  }) => {
    const res = await updateAppointment(appointment, appointmentId);
    return {
      appointment: res,
    };
  }
);

export const removeAppointment = createAsyncThunk(
  "appointments/doRemoveAppointment",
  async (appointmentId: string) => {
    await deleteAppointment(appointmentId);
    return {
      appointmentId,
    };
  }
);

export const setPagination = createAction(
  "appointments/doSetPagination",
  (pagination: PaginationType) => {
    return {
      payload: pagination,
    };
  }
);

export const setSelectedAppointment = createAction(
  "appointments/setAppointment",
  (appointment: AppointmentType) => {
    return {
      payload: appointment,
    };
  }
);

export const setSelectedAppointmentById = createAction(
  "appointments/setAppointmentById",
  (appointmentId: string) => {
    return {
      payload: appointmentId,
    };
  }
);

// export const setLoading = createAction('staffs/setLoading', (state))

export const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setAppointments, (state, action) => {
      state.appointments = action.payload;
    });
    builder.addCase(getAppointments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAppointments.fulfilled, (state, action) => {
      state.appointments = action.payload.appointments;
      state.pagination = action.payload.pagination;
      state.loading = false;
    });
    builder.addCase(setPagination, (state, action) => {
      state.pagination = action.payload;
    });
    builder.addCase(setSelectedAppointment, (state, action) => {
      state.selectedAppointment = action.payload;
    });
    builder.addCase(editAppointment.fulfilled, (state, action) => {
      state.appointments = state.appointments?.map((appointment) => {
        if (appointment.id === action.payload.appointment.id) {
          return action.payload.appointment;
        }
        return appointment;
      });
      state.selectedAppointment = action.payload.appointment;
    });
    builder.addCase(removeAppointment.fulfilled, (state, action) => {
      state.appointments = state.appointments?.filter(
        (appointment) => appointment.id !== action.payload.appointmentId
      );
      state.selectedAppointment = undefined;
    });
    builder.addCase(setSelectedAppointmentById, (state, action) => {
      state.selectedAppointment = state.appointments?.find(appointment => appointment.id === action.payload)
    })
  },
});

export default appointmentsSlice.reducer;
