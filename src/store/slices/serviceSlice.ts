import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PaginationType } from "../../types/generalTypes";
import { ProductType } from "../../types/product";
import {
  createProduct,
  deleteProduct,
  getProducts as getP,
  updateProduct,
} from "../../services/product";

export interface ServiceState {
  loading: boolean;
  services: ProductType[] | undefined;
  selectedService: ProductType | undefined;
  pagination: PaginationType;
}

const initialState: ServiceState = {
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

export const setServices = createAction(
  "services/doSetServices",
  (services: ProductType[]) => {
    return {
      payload: services,
    };
  }
);

export const getServices = createAsyncThunk(
  "services/doGetServices",
  async ({
    pagination,
  }: {
    pagination: PaginationType;
  }) => {
    const res = await getP("SERVICE", pagination);
    return {
      services: res,
      pagination,
    };
  }
);

export const addService = createAsyncThunk(
  "services/doCreateService",
  async (service: ProductType, { dispatch }) => {
    await createProduct(service);
    dispatch(
      getServices({
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

export const editService = createAsyncThunk(
  "services/doEditService",
  async ({
    service,
    serviceId,
  }: {
    service: ProductType;
    serviceId: string;
  }) => {
    const res = await updateProduct(service, serviceId);
    return {
      service: res,
    };
  }
);

export const removeService = createAsyncThunk(
  "services/doRemoveService",
  async (serviceId: string) => {
    await deleteProduct(serviceId);
    return {
      serviceId,
    };
  }
);

export const setPagination = createAction(
  "services/doSetPagination",
  (pagination: PaginationType) => {
    return {
      payload: pagination,
    };
  }
);

export const setSelectedService = createAction(
  "services/setService",
  (service: ProductType) => {
    return {
      payload: service,
    };
  }
);

// export const setLoading = createAction('staffs/setLoading', (state))

export const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setServices, (state, action) => {
      state.services = action.payload;
    });
    builder.addCase(getServices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getServices.fulfilled, (state, action) => {
      state.services = action.payload.services;
      state.pagination = action.payload.pagination;
      state.loading = false;
    });
    builder.addCase(setPagination, (state, action) => {
      state.pagination = action.payload;
    });
    builder.addCase(setSelectedService, (state, action) => {
      state.selectedService = action.payload;
    });
    builder.addCase(editService.fulfilled, (state, action) => {
      state.services = state.services?.map((service) => {
        if (service.id === action.payload.service.id) {
          return action.payload.service;
        }
        return service;
      });
      state.selectedService = action.payload.service;
    });
    builder.addCase(removeService.fulfilled, (state, action) => {
      state.services = state.services?.filter(
        (service) => service.id !== action.payload.serviceId
      );
      state.selectedService = undefined;
    });
  },
});

export default servicesSlice.reducer;
