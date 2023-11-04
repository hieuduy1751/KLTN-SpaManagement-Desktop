import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setUser } from "./userSlice";
import {
  deleteToken,
  deleteUser,
  persistToken,
  readToken,
} from "../../services/localStorage.service";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { isAdmin } from "../../services/admin.service";

export interface AuthSlice {
  token: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

const initialState: AuthSlice = {
  token: readToken(),
};

export const doLogin = createAsyncThunk(
  "auth/doLogin",
  (loginPayload: LoginRequest, { dispatch }) =>
    signInWithEmailAndPassword(
      auth,
      loginPayload.email,
      loginPayload.password
    ).then(async (res) => {
      const user = res.user;
      if (await isAdmin(user.uid)) {
        dispatch(setUser(res.user));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        persistToken(user?.accessToken);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return user?.accessToken;
      } else {
        throw new Error("Your account is not admin")
      }
    })
);
export const doLogout = createAsyncThunk(
  "auth/doLogout",
  (_,{ dispatch }) => {
    deleteToken();
    deleteUser();
    dispatch(setUser(null));
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doLogin.fulfilled, (state, action) => {
      state.token = action.payload;
    });
    builder.addCase(doLogout.fulfilled, (state) => {
      state.token = "";
    });
  },
});

export default authSlice.reducer;
