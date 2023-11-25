import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { persistUser, readUser } from '../../services/localStorage';

export type User = {
  username: string
}

export interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: readUser(),
};

export const setUser = createAction<PrepareAction<User>>('user/setUser', (newUser) => {
  persistUser(newUser);

  return {
    payload: newUser,
  };
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setUser, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default userSlice.reducer;