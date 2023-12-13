import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PaginationType } from "../../types/generalTypes";
import { TreatmentType } from "../../types/treatment";
import { createTreatment, deleteTreatment, getTreatments as getT, updateTreatment } from "../../services/treatment";

export interface ServedServiceState {
  loading: boolean;
  services: TreatmentType[] | undefined;
  selectedService: TreatmentType | undefined;
  pagination: PaginationType;
}

const initialState: ServedServiceState = {
  loading: false,
  services: [],
  selectedService: undefined,
  pagination: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 50,
    },
  },
};

export const setServedServices = createAction(
  "servedServices/doSetServedServices",
  (servedServices: TreatmentType[]) => {
    return {
      payload: servedServices,
    };
  }
);

export const getServedServices = createAsyncThunk(
  "servedServices/doGetServedServices",
  async ({ pagination }: { pagination: PaginationType }) => {
    const res = await getT(pagination);
    return {
      servedServices: res,
      pagination,
    };
  }
);

export const addServedServices = createAsyncThunk(
  "servedServices/doCreateServedService",
  async (servedService: TreatmentType, { dispatch }) => {
    await createTreatment(servedService);
    dispatch(
      getServedServices({
        pagination: {
          pagination: {
            current: 1,
            pageSize: 10,
            total: 50,
          },
        },
      })
    );
  }
);

export const editServedService = createAsyncThunk(
  "servedServices/doEditServedService",
  async ({
    servedService,
  }: {
    servedService: TreatmentType;
  }) => {
    const res = await updateTreatment(servedService);
    return {
      servedService: res,
    };
  }
);

export const removeServedService = createAsyncThunk(
  "servedServices/doRemoveServedService",
  async (servedServiceId: string) => {
    await deleteTreatment(servedServiceId);
    return {
      servedServiceId,
    };
  }
);

export const setPagination = createAction(
  "servedServices/doSetPagination",
  (pagination: PaginationType) => {
    return {
      payload: pagination,
    };
  }
);

export const setSelectedServedService = createAction(
  "servedServices/setServedService",
  (servedService: TreatmentType) => {
    return {
      payload: servedService,
    };
  }
);

// export const setLoading = createAction('staffs/setLoading', (state))

export const servedServicesSlice = createSlice({
  name: "servedServices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setServedServices, (state, action) => {
      state.services = action.payload;
    });
    builder.addCase(getServedServices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getServedServices.fulfilled, (state, action) => {
      state.services = action.payload.servedServices;
      state.pagination = action.payload.pagination;
      state.loading = false;
    });
    builder.addCase(setPagination, (state, action) => {
      state.pagination = action.payload;
    });
    builder.addCase(setSelectedServedService, (state, action) => {
      state.selectedService = action.payload;
    });
    builder.addCase(editServedService.fulfilled, (state, action) => {
      state.services = state.services?.map((servedService) => {
        if (servedService.id === action.payload.servedService.id) {
          return action.payload.servedService;
        }
        return servedService;
      });
      state.selectedService = action.payload.servedService;
    });
    builder.addCase(removeServedService.fulfilled, (state, action) => {
      state.services = state.services?.filter(
        (servedService) => servedService.id !== action.payload.servedServiceId
      );
      state.selectedService = undefined;
    });
  },
});

export default servedServicesSlice.reducer;
