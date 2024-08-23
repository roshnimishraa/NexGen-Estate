import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  error: null,
  loading : false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },
        loginError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart(state){
            state.loading = true;
        },
        updateUserSuccess(state, action){
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },
        updateUserError(state, action){
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserSuccess(state){
            state.user = null;
            state.error = null;
            state.loading = false;
        },
        deleteUserError(state, action){
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart(state){
            state.loading = true;
        },
        logoutUserSuccess(state){
            state.user = null;
            state.error = null;
            state.loading = false;
        },
        logoutUserError(state, action){
            state.loading = false;
            state.error = action.payload;
        },
        logoutUserStart(state){
            state.loading = true;
        },
    },
});

export const { loginStart, loginSuccess, loginError , updateUserStart , updateUserSuccess , updateUserError , deleteUserError,deleteUserStart,deleteUserSuccess , logoutUserError , logoutUserStart , logoutUserSuccess} = userSlice.actions;

export default userSlice.reducer;