import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    me: null,
  },
  reducers: {
    setMe: (state, action) => {
      state.me = action.payload;

      console.log("State Me: ", state.me);
    },
  },
});

export const { setMe } = userSlice.actions;
export default userSlice.reducer;
