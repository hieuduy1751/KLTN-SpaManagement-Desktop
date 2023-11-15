import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { StaffType } from "../../types/staff";
import { PaginationType } from "../../types/generalTypes";
import { createStaff, deleteStaff, updateStaff, getStaffs as getS } from "../../services/staff";


export interface StaffState {
  loading: boolean;
  staffs: StaffType[] | undefined;
  selectedStaff: StaffType | undefined;
  pagination: PaginationType;
}

const initialState: StaffState = {
  loading: false,
  staffs: [],
  selectedStaff: undefined,
  pagination: {
    pagination: {
      current: 1,
      pageSize: 10,
      total: 10,
    },
  },
};

export const setStaffs = createAction(
  "staffs/doSetStaffs",
  (staffs: StaffType[]) => {
    return {
      payload: staffs,
    };
  }
);

export const getStaffs = createAsyncThunk(
  "staffs/doGetStaffs",
  async (pagination: PaginationType) => {
    const res = await getS(pagination);
    return {
      staffs: res,
      pagination,
    };
  }
);

export const addStaff = createAsyncThunk(
  "staffs/doCreateStaff",
  async (staff: StaffType, { dispatch }) => {
    await createStaff(staff);
    dispatch(
      getStaffs({
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
      })
    );
  }
);

export const editStaff = createAsyncThunk(
  "staffs/doEditStaff",
  async ({
    staff,
    staffId,
  }: {
    staff: StaffType;
    staffId: string;
  }) => {
    const res = await updateStaff(staff, staffId);
    return {
      staff: res,
    };
  }
);

export const removeStaff = createAsyncThunk(
  "staffs/doRemoveStaff",
  async (staffId: string) => {
    await deleteStaff(staffId)
    return {
      staffId
    }
  }
)

export const setPagination = createAction(
  "staffs/doSetPagination",
  (pagination: PaginationType) => {
    return {
      payload: pagination,
    };
  }
);

export const setSelectedStaff = createAction(
  "staffs/setStaff",
  (staff: StaffType) => {
    return {
      payload: staff,
    };
  }
);

// export const setLoading = createAction('staffs/setLoading', (state))

export const staffsSlice = createSlice({
  name: "staffs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setStaffs, (state, action) => {
      state.staffs = action.payload;
    });
    builder.addCase(getStaffs.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getStaffs.fulfilled, (state, action) => {
      state.staffs = action.payload.staffs;
      state.pagination = action.payload.pagination;
      state.loading = false;
    });
    builder.addCase(setPagination, (state, action) => {
      state.pagination = action.payload;
    });
    builder.addCase(setSelectedStaff, (state, action) => {
      state.selectedStaff = action.payload;
    });
    builder.addCase(editStaff.fulfilled, (state, action) => {
      state.staffs = state.staffs?.map((staff) => {
        if (staff.id === action.payload.staff.id) {
          return action.payload.staff;
        }
        return staff;
      });
      state.selectedStaff = action.payload.staff
    });
    builder.addCase(removeStaff.fulfilled, (state, action) => {
      state.staffs = state.staffs?.filter(staff => staff.id !== action.payload.staffId)
      state.selectedStaff = undefined
    })
  },
});

export default staffsSlice.reducer;
