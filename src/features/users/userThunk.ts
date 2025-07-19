import { createAsyncThunk } from "@reduxjs/toolkit";
import {  updateUser } from "../services/userService";
import type { User } from "../types/commontypes";
import { fetchAdminProfile, fetchUserProfile } from "../../services/authServices";

export const getUserProfile= createAsyncThunk<
    User,
    void,
    { rejectValue: string }
>('users/getUserProfile', async (_, thunkAPI) => {
    try {
        const data = await fetchUserProfile();
        console.log("Data from the get current user:", data);
        return data as User;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "Failed to fetch current user";
        return thunkAPI.rejectWithValue(message);
    }
});

export const getAdminProfile = createAsyncThunk<
    User,
    void,
    { rejectValue: string }
>('users/getAdminProfile', async (_, thunkAPI) => {
    try {
        const data = await fetchAdminProfile();
        console.log("Data from the get current user:", data);
        return data as User;
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || "Failed to fetch current user";
        return thunkAPI.rejectWithValue(message);
    }
});


export const udpateCurrentUser = createAsyncThunk<
    User,
    { userId: string; username: string; email: string, image: string, status: boolean },
    { rejectValue: string }
>('user/udpateCurrentUser', async ({ userId, username, email, image, status }, thunkAPI) => {
    try {
        const data = await updateUser(userId, { username, email, image, status });
        return data as User;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

