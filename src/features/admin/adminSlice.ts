import { createSlice } from "@reduxjs/toolkit";
import {
    getAllUsers,
    updateUserStatus,
    createNewUser,
    updateUserByAdmin,
    deleteUserByAdmin
} from "./adminThunk";
import type { adminState } from "../types/commontypes";

const initialState: adminState = {
    users: [],
    isLoading: false,
    error: null,
};

const adminSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload
        },
        updateUser: (state, action) => {
            const index = state.users.findIndex((user) => user._id === action.payload._id);
            if (index !== -1) {
                state.users[index] = action.payload; 
            }
        },
        toggleStatus: (state, action) => {
            const index = state.users.findIndex((user) => user._id === action.payload.userId);
            if (index !== -1) {
                state.users[index].status = !state.users[index].status 
            }
        },
        reloadUsers: (state, action) => {
            state.users = state.users.filter((user) => user._id != action.payload)
        }

    },
    extraReducers: (builder) => {
        builder
            // Get all users
            .addCase(getAllUsers.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log("Action payload:", action)
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = typeof  action.payload || "Failed to fetch users";
            })

            // Update user status
            .addCase(updateUserStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserStatus.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(updateUserStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = typeof action.payload || "Failed to fetch users";
            })

            // Create new user
            .addCase(createNewUser.pending, state => {
                state.isLoading = true;
                state.error = null
            })
            .addCase(createNewUser.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createNewUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = typeof action.payload || "Failed create new user";
            })
        
            // Update user
            .addCase(updateUserByAdmin.pending, state => {
                state.isLoading = true;
                state.error = null
            })
            .addCase(updateUserByAdmin.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(updateUserByAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = typeof action.payload || "Failed udpate user";
            })

            // Delete User
            .addCase(deleteUserByAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null
            })
            .addCase(deleteUserByAdmin.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(deleteUserByAdmin.rejected, (state, actoin) => {
                state.isLoading = false;
                state.error = typeof actoin.payload || "Error delete user"
            })    
            // 
    }
});

export const { setUsers ,updateUser, toggleStatus, reloadUsers} = adminSlice.actions;
export const adminReducer = adminSlice.reducer;
