import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PaginationType } from "../../types/generalTypes";
import { TreatmentType } from "../../types/treatment";
import { createTreatment, deleteTreatment, getTreatments as getT, updateTreatment } from "../../services/treatment";

export interface TreatmentState {
  loading: boolean;
  treatments: TreatmentType[] | undefined;
  selectedTreatment: TreatmentType | undefined;
  pagination: PaginationType;
}

const initialState: TreatmentState = {
  loading: false,
  treatments: [],
  selectedTreatment: undefined,
  pagination: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 50,
    },
  },
};

export const setTreatments = createAction(
  "treatments/doSetTreatments",
  (treatments: TreatmentType[]) => {
    return {
      payload: treatments,
    };
  }
);

export const getTreatments = createAsyncThunk(
  "treatments/doGetTreatments",
  async ({ pagination }: { pagination: PaginationType }) => {
    const res = await getT(pagination);
    return {
      treatments: res,
      pagination,
    };
  }
);

export const addTreatment = createAsyncThunk(
  "treatments/doCreateTreatment",
  async (treatment: TreatmentType, { dispatch }) => {
    await createTreatment(treatment);
    dispatch(
      getTreatments({
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

export const editTreatment = createAsyncThunk(
  "treatments/doEditTreatment",
  async ({
    treatment,
  }: {
    treatment: TreatmentType;
  }) => {
    const res = await updateTreatment(treatment);
    return {
      treatment: res,
    };
  }
);

export const removeTreatment = createAsyncThunk(
  "treatments/doRemoveTreatment",
  async (treatmentId: string) => {
    await deleteTreatment(treatmentId);
    return {
      treatmentId,
    };
  }
);

export const setPagination = createAction(
  "treatments/doSetPagination",
  (pagination: PaginationType) => {
    return {
      payload: pagination,
    };
  }
);

export const setSelectedTreatment = createAction(
  "treatments/setTreatment",
  (treatment: TreatmentType) => {
    return {
      payload: treatment,
    };
  }
);

// export const setLoading = createAction('staffs/setLoading', (state))

export const treatmentsSlice = createSlice({
  name: "treatments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setTreatments, (state, action) => {
      state.treatments = action.payload;
    });
    builder.addCase(getTreatments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTreatments.fulfilled, (state, action) => {
      state.treatments = action.payload.treatments;
      state.pagination = action.payload.pagination;
      state.loading = false;
    });
    builder.addCase(setPagination, (state, action) => {
      state.pagination = action.payload;
    });
    builder.addCase(setSelectedTreatment, (state, action) => {
      state.selectedTreatment = action.payload;
    });
    builder.addCase(editTreatment.fulfilled, (state, action) => {
      state.treatments = state.treatments?.map((treatment) => {
        if (treatment.id === action.payload.treatment.id) {
          return action.payload.treatment;
        }
        return treatment;
      });
      state.selectedTreatment = action.payload.treatment;
    });
    builder.addCase(removeTreatment.fulfilled, (state, action) => {
      state.treatments = state.treatments?.filter(
        (treatment) => treatment.id !== action.payload.treatmentId
      );
      state.selectedTreatment = undefined;
    });
  },
});

export default treatmentsSlice.reducer;
