import axios from "axios";
export const BASE_URL = process.env.NEXT_PUBLIC_API;

const restApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
restApi.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
export { restApi };
