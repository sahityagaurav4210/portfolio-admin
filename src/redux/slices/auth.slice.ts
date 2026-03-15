import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthState } from "../../interfaces/redux.interface";
import { IAuthUserPayload } from "../../interfaces/states.interfaces";

const initialState: IAuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<IAuthUserPayload>) => {
      state.user = action.payload;
    },
    clearAuthUser: (state) => {
      state.user = null;
    },
  },
});

export const { setAuthUser, clearAuthUser } = authSlice.actions;

export default authSlice.reducer;
