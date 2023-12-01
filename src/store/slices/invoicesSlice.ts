import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PaginationType } from "../../types/generalTypes";
import { InvoiceType } from "../../types/invoice";
import { createInvoice, deleteInvoice, getInvoices as getI, updateInvoice } from "../../services/invoice";

export interface InvoiceState {
  loading: boolean;
  invoices: InvoiceType[] | undefined;
  selectedInvoice: InvoiceType | undefined;
  pagination: PaginationType;
}

const initialState: InvoiceState = {
  loading: false,
  invoices: [],
  selectedInvoice: undefined,
  pagination: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 10,
    },
  },
};

export const setInvoices = createAction(
  "invoices/doSetInvoices",
  (invoices: InvoiceType[]) => {
    return {
      payload: invoices,
    };
  }
);

export const getInvoices = createAsyncThunk(
  "invoices/doGetInvoices",
  async ({
    pagination,
  }: {
    pagination: PaginationType;
  }) => {
    const res = await getI(pagination);
    return {
      invoices: res,
      pagination,
    };
  }
);

export const addInvoice = createAsyncThunk(
  "invoices/doCreateInvoice",
  async (invoice: InvoiceType, { dispatch }) => {
    await createInvoice(invoice);
    dispatch(
      getInvoices({
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

export const editInvoice = createAsyncThunk(
  "invoices/doEditInvoice",
  async ({
    invoice,
    invoiceId,
  }: {
    invoice: InvoiceType;
    invoiceId: string;
  }) => {
    const res = await updateInvoice(invoice, invoiceId);
    return {
      invoice: res,
    };
  }
);

export const removeInvoice = createAsyncThunk(
  "invoices/doRemoveInvoice",
  async (invoiceId: string) => {
    await deleteInvoice(invoiceId);
    return {
      invoiceId,
    };
  }
);

export const setPagination = createAction(
  "invoices/doSetPagination",
  (pagination: PaginationType) => {
    return {
      payload: pagination,
    };
  }
);

export const setSelectedInvoice = createAction(
  "invoices/setInvoice",
  (invoice: InvoiceType) => {
    return {
      payload: invoice,
    };
  }
);

// export const setLoading = createAction('staffs/setLoading', (state))

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setInvoices, (state, action) => {
      state.invoices = action.payload;
    });
    builder.addCase(getInvoices.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getInvoices.fulfilled, (state, action) => {
      state.invoices = action.payload.invoices;
      state.pagination = action.payload.pagination;
      state.loading = false;
    });
    builder.addCase(setPagination, (state, action) => {
      state.pagination = action.payload;
    });
    builder.addCase(setSelectedInvoice, (state, action) => {
      state.selectedInvoice = action.payload;
    });
    builder.addCase(editInvoice.fulfilled, (state, action) => {
      state.invoices = state.invoices?.map((product) => {
        if (product.id === action.payload.invoice.id) {
          return action.payload.invoice;
        }
        return product;
      });
      state.selectedInvoice = action.payload.invoice;
    });
    builder.addCase(removeInvoice.fulfilled, (state, action) => {
      state.invoices = state.invoices?.filter(
        (invoice) => invoice.id !== action.payload.invoiceId
      );
      state.selectedInvoice = undefined;
    });
  },
});

export default invoicesSlice.reducer;
