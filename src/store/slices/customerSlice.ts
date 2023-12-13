import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CustomerType } from "../../types/customer";
import { PaginationType } from "../../types/generalTypes";
import {
  createCustomer,
  deleteCustomer,
  getCustomers as getC,
  updateCustomer,
} from "../../services/customer";

export interface CustomerState {
  loading: boolean;
  customers: CustomerType[] | undefined;
  selectedCustomer: CustomerType | undefined;
  pagination: PaginationType;
}

const initialState: CustomerState = {
  loading: false,
  customers: [],
  selectedCustomer: undefined,
  pagination: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 50,
    },
  },
};

export const setCustomers = createAction(
  "customers/doSetCustomers",
  (customers: CustomerType[]) => {
    return {
      payload: customers,
    };
  }
);

export const getCustomers = createAsyncThunk(
  "customers/doGetCustomers",
  async (pagination: PaginationType) => {
    const res = await getC(pagination);
    return {
      customers: res,
      pagination,
    };
  }
);

export const addCustomer = createAsyncThunk(
  "customers/doCreateCustomer",
  async (customer: CustomerType, { dispatch }) => {
    await createCustomer(customer);
    dispatch(
      getCustomers({
        pagination: {
          current: 1,
          pageSize: 10,
          total: 50,
        },
      })
    );
  }
);

export const editCustomer = createAsyncThunk(
  "customers/doEditCustomer",
  async ({
    customer,
    customerId,
  }: {
    customer: CustomerType;
    customerId: string;
  }) => {
    const res = await updateCustomer(customer, customerId);
    return {
      customer: res,
    };
  }
);

export const removeCustomer = createAsyncThunk(
  "customers/doRemoveCustomer",
  async (customerId: string) => {
    await deleteCustomer(customerId)
    return {
      customerId
    }
  }
)

export const setPagination = createAction(
  "customers/doSetPagination",
  (pagination: PaginationType) => {
    return {
      payload: pagination,
    };
  }
);

export const setSelectedCustomer = createAction(
  "customers/setCustomer",
  (customer: CustomerType) => {
    return {
      payload: customer,
    };
  }
);

// export const setLoading = createAction('customers/setLoading', (state))

export const usersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setCustomers, (state, action) => {
      state.customers = action.payload;
    });
    builder.addCase(getCustomers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCustomers.fulfilled, (state, action) => {
      state.customers = action.payload.customers;
      state.pagination = action.payload.pagination;
      state.loading = false;
    });
    builder.addCase(setPagination, (state, action) => {
      state.pagination = action.payload;
    });
    builder.addCase(setSelectedCustomer, (state, action) => {
      state.selectedCustomer = action.payload;
    });
    builder.addCase(editCustomer.fulfilled, (state, action) => {
      state.customers = state.customers?.map((customer) => {
        if (customer.id === action.payload.customer.id) {
          return action.payload.customer;
        }
        return customer;
      });
      state.selectedCustomer = action.payload.customer
    });
    builder.addCase(removeCustomer.fulfilled, (state, action) => {
      state.customers = state.customers?.filter(customer => customer.id !== action.payload.customerId)
      state.selectedCustomer = undefined
    })
  },
});

export default usersSlice.reducer;
