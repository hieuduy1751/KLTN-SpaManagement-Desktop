import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type UserData = {
  username: string;
  userId: string
};

export interface UserState {
  users: UserData[] | null;
}

const initialState: UserState = {
  users: [],
};

export const setUsers = async () => {}

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
  },
});

export default usersSlice.reducer;
