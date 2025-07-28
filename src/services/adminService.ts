import instance from "../config/axios";
import type { UserFormData } from "../pages/AdminDashboard";

interface User {
    _id?: string;
    username: string;
    email: string;
    role: string;
    image?: string;
    status?: boolean;
}

export const getAllusers = async () => {    
    const response = await instance.get("/admin/users");
    return response.data
}

export const updateUser = async (data: UserFormData): Promise<User> => {
    console.log("data at the updateUser function:", data)
    const response = await instance.put(`/admin/users/${data.userId}`, data);
    console.log('update user function at admin service:', response);
    return response.data as User;
}

export const deleteUser = async (userId: string): Promise<any> => {
    console.log("user id at the delete user function:", userId)
    const response = await instance.delete(`/admin/users/${userId}`);
    console.log("abcd:",response)
    return response.data as any
};

export const updateUserStatus = async (userId: string) => {
    console.log("user id at the admin service, usercstatus function:", userId)
    const response = await instance.patch(`/admin/users/status/${userId}`);
    console.log("Update user status response:", response)
    return response.data 
};

export const createUser = async (user: UserFormData):Promise<UserFormData> => {
    console.log("User data at the create user admin service:", user)
    const response = await instance.post("/admin/users/create", user);
    console.log("create user response:", response)
    return response.data as UserFormData
}