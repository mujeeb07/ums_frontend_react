import axiosinstance from "../../config/axios";

export const fetchUsers = async (page: number, limit:number) => {
    const response = await axiosinstance.get(`admin/users?page=${page}&limit=${limit}`);
    return response.data;
}

export const updateUser = async (userId: string, updatedData: { username: string, email: string, image: string, status: boolean }) => {
  const response = await axiosinstance.put(`users/${userId}`, updatedData);
  return response.data;
}

export const updateUserStatus = async (userId: string | number ) => {
  const response = await axiosinstance.patch(`users/${userId}/status`);
  return response.data
}
