import { createSlice } from "@reduxjs/toolkit";
import {  getAdminProfile, getUserProfile } from "./userThunk";
import type { userState } from "../types/commontypes";

const initialState: userState = {
    user: null,
    isLoading: false,
    error: null,
    isDarkTheme: true
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        toggleTheme: (state, action) => {
            state.isDarkTheme = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // User profile
            .addCase(getUserProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || "Failed to fetch user profile";
            })

            // Admin profile
            .addCase(getAdminProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAdminProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(getAdminProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || "Failed to fetch admin profile";
            });
    }
    
});

export const { toggleTheme } = userSlice.actions;
export const userReducer = userSlice.reducer;



