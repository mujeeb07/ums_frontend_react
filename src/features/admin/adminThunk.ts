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
    users: User[];
    total: number;
}

export const getAllUsers = createAsyncThunk<
    GetAllUsersResponse,
    { page: number; limit: number },
    { rejectValue: string }
>(
    "users/getAll",
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            const response = await fetchUsers(page, limit);

            return response as GetAllUsersResponse;
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || "Failed to fetch users";
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
            const response = await apiUpdaterStatus(userId);
            console.log("Thunk updateuserstatus:", response);
            return { userId }
        } catch (error: any) {
            const message =
                error.response?.data?.message || error.message || "Failed to update user status";
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
            console.log("Thunk create user response:", response);
            return response
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Failed to create new user";
            return rejectWithValue(message)
        }
        
    }
);

export const updateUserByAdmin = createAsyncThunk(
    "users/updateUser",
    async (updatedUserFormData: UserFormData, { rejectWithValue }) => {
        console.log("user data at the udpate user thunk:", updatedUserFormData);
        try {
            const response = await updateUser(updatedUserFormData);
            return response as UserFormData;
        } catch (error: any) {
            console.log(error);
            const message = error.response?.data?.message || error.message || "Failed to update user";
            return rejectWithValue(message)
        }
    }
);

export const deleteUserByAdmin = createAsyncThunk
  (
    "users/deleteUser",
    async (userId: string, { rejectWithValue }) => {
        console.log("Delete User Id:", userId);
        try {
            const response = await deleteUser(userId);
            console.log("Delte user response:", response);
            return response
        } catch (error: any) {
            console.log(error);
            const message = error.response?.data?.message || error.message || "Failed delete user";
            return rejectWithValue(message)
        }
    }
);


