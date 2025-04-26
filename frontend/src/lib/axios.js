import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api" , // replace with your API URL
    withCredentials: true, // send cookies with requests/server-side rendering
});

export default axiosInstance;