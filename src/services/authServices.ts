import axiosinstance from '../config/axios';
import type { RegisterPayload, LoginPayload } from '../types/auth';

export const registerUser = async (data: RegisterPayload) => {
    const response = await axiosinstance.post("/auth/register", data);
    return response.data;
}

export const loginUser = async (data: LoginPayload) => {
    console.log("Login user service....", data)
    const response = await axiosinstance.post("/auth/login", data);
    console.log("Login User Data:",response.data)
    return response.data;
}


export const fetchUserProfile = async () => {
    const response = await axiosinstance.get("/users/profile");
    return response.data;
}

export const fetchAdminProfile = async () => {
    const response = await axiosinstance.get("/admin/profile");
    return response.data;
}


export const lgoutUser = async () => {
    const response = await axiosinstance.post("/auth/logout");
    return response.data;
}