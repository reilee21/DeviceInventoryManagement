import axios from "axios"
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios"

const http: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
})

// Request interceptor for Auth token
http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("access_token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// Response interceptor for standardization
http.interceptors.response.use(
    (response) => {
        const apiResponse = response.data
        if (apiResponse && typeof apiResponse === "object" && "success" in apiResponse) {
            if (!apiResponse.success) {
                return Promise.reject(apiResponse)
            }
        }
        return response
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.warn("Unauthorized! Session may have expired.")
        }
        if (error.response?.data) {
            return Promise.reject(error.response.data)
        }
        return Promise.reject(error)
    }
)

export default http
