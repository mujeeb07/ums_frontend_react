import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers } from "../services/userService";
import {
    updateUserStatus as apiUpdaterStatus,
    createUser,
    updateUser,
    deleteUser,
} from "../../services/adminService";
import type { User } from "../types/commontypes";
import type { UserFormData } from "../../pages/AdminDashboard";

interface GetAllUsersResponse {
    searchQuery: string;
    users: User[];
    total: number;
}

export const getAllUsers = createAsyncThunk<
    GetAllUsersResponse,
    { searchQuery: string; page: number; limit: number },
    { rejectValue: string }
>(
    "users/getAll",
    async ({ searchQuery, page, limit }, { rejectWithValue }) => {
        console.log("SERCH_QUERY:", searchQuery, page, limit)
        try {
            const response = await fetchUsers(searchQuery, page, limit);
            return response as GetAllUsersResponse;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Failed to fetch users";
            return rejectWithValue(message);
        }
    }
);

export const updateUserStatus = createAsyncThunk<
    {userId: string},
    { userId: string },
    { rejectValue: string }
>(
    "users/updateUserStatus",
    async ({ userId }, { rejectWithValue }) => {
        try {
            await apiUpdaterStatus(userId);
            // console.log("Thunk updateuserstatus:", response);
            return { userId }
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Failed to update user status";
            return rejectWithValue(message);
        }
    }
);

export const createNewUser = createAsyncThunk<
    UserFormData,                              
    { formData: UserFormData },                
    { rejectValue: string }
>(
    "users/createUser",
    async ({ formData }, { rejectWithValue }) => {
        try {
            const response = await createUser(formData);
            // console.log("Thunk create user response:", response);
            return response
        } catch (error: any) {
            console.log("Create user by admin error:", error.response.data.message)
            const message = error.response.data.message;
            return rejectWithValue(message)
        }
        
    }
);

export const updateUserByAdmin = createAsyncThunk(
    "users/updateUser",
    async (updatedUserFormData: UserFormData, { rejectWithValue }) => {
        // console.log("user data at the udpate user thunk:", updatedUserFormData);
        try {
            const response = await updateUser(updatedUserFormData);
            return response as UserFormData;
        } catch (error: any) {
            // console.log(error);
            const message = error.response?.data?.message || error.message || "Failed to update user";
            return rejectWithValue(message)
        }
    }
);

export const deleteUserByAdmin = createAsyncThunk
  (
    "users/deleteUser",
    async (userId: string, { rejectWithValue }) => {
        // console.log("Delete User Id:", userId);
        try {
            const response = await deleteUser(userId);
            // console.log("Delte user response:", response);
            return response
        } catch (error: any) {
            // console.log(error);
            const message = error.response?.data?.message || error.message || "Failed delete user";
            return rejectWithValue(message)
        }
    }
);
