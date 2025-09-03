import { createAsyncThunk } from "@reduxjs/toolkit";
import { lgoutUser, loginUser, registerUser } from "../../services/authServices";
import type { RegisterPayload } from "../../types/auth";
import { setUserLogout } from "./authSlice";


interface LoginData {
    email: string;
    password: string;
}


export const register = createAsyncThunk<
    any,
    RegisterPayload,
    { rejectValue: string }
>(
    "auth/register",
    async (registerData, { rejectWithValue }) => {
        // console.log("Registration data at register thunk:", registerData)
        try {
            const res = await registerUser(registerData);
            return res
        } catch (error: any) {
            // console.log("Error data at registration thunk:",error.response.data.message)
            const message = error.response?.data?.message || "Registration failed";
            return rejectWithValue(message);
        }
    }
)

export const login = createAsyncThunk<
    any,
    LoginData,
    { rejectValue: string }
>(
    "auth/login",
    async (loginData, { rejectWithValue }) => {
        // console.log("loginserviceceeee")
        try {
            const res = await loginUser(loginData);
            return res
        } catch (error: any) {
            // console.log("Login error:", error);
            const message = error.response?.data?.message.message || "Failed to login user";
            // console.log("Error message:",message)
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
            setUserLogout()
        } catch (error: any) {
            // console.log("Logout error:", error);
            const message = error.response?.data?.message || error.message || "Failed to logout user";
            return rejectWithValue(message);
        }
    }
);

   