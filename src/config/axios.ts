import axios from "axios";

const axiosinstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND,
    withCredentials: true,
});

axiosinstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token && config.headers) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
  
export default axiosinstance