import { createAsyncThunk } from "@reduxjs/toolkit";
import { lgoutUser, loginUser } from "../../services/authServices";

interface LoginData {
    email: string;
    password: string;
}

export const login = createAsyncThunk<
    any,
    LoginData,
    { rejectValue: string }
>(
    "auth/login",
    async (loginData, { rejectWithValue }) => {
        try {
            const res = await loginUser(loginData); 
            return res
        } catch (error: any) {
            console.log("Login error:", error);
            const message = error.response?.data?.message || error.message || "Failed to login user";
            return rejectWithValue(message);
        }
    }
);




export const logout = createAsyncThunk<
    void,            
    void,            
    { rejectValue: string }
>(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            await lgoutUser();
            
        } catch (error: any) {
            console.log("Logout error:", error);
            const message = error.response?.data?.message || error.message || "Failed to logout user";
            return rejectWithValue(message);
        }
    }
);
