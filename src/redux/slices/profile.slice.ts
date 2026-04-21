import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthUserProfileState } from "../../interfaces/redux.interface";
import { IAuthUserProfilePayload } from "../../interfaces/states.interfaces";

const initialState: IAuthUserProfileState = {
  profile: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<IAuthUserProfilePayload>) => {
      state.profile = action.payload;
    },

    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;