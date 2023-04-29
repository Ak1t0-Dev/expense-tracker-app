import { createSlice } from "@reduxjs/toolkit";
import { UserInfo } from "../../types/types";

interface UserState {
  user: UserInfo | null;
  isLoginned: boolean;
}

const initialState: UserState = {
  user: null,
  isLoginned: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoginned = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLoginned = false;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
