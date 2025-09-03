import axios from 'axios';

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


let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });

    failedQueue = [];
}

axiosinstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolved, rejected) {
                    failedQueue.push({ resolved, rejected })
                })
                    .then((token) => {
                        originalRequest.headers["Authorization"] = "Bearer " + token;
                        return axiosinstance(originalRequest);
                    })
                    .catch((error) => {
                        return Promise.reject(error);
                    })
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = await axios.post<{ accessToken: string }>(
                    `${axiosinstance.defaults.baseURL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const newAccesstoken = response.data.accessToken;
                localStorage.setItem("accessToken", newAccesstoken);

                // axiosinstance.defaults.headers.common["Authorization"] = "Bearer " + newAccesstoken;
                return axiosinstance(originalRequest)

            } catch (error) {
                processQueue(error, null);
                isRefreshing = false;
                return Promise.reject(error)
            }
        }
        return Promise.reject(error);
    }
);

export default axiosinstance