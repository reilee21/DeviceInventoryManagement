import http from "./http"

export interface LoginResponse {
    access_token: string
    user: {
        id: string
        username: string
        role: string
    }
}

export const authApi = {
    login: async (credentials: any) => {
        const { data } = await http.post<{ status: string; access_token: string; data: { user: any } }>("/auth/login", credentials)
        return {
            access_token: data.access_token,
            user: data.data.user
        }
    },
    getProfile: async () => {
        const { data } = await http.get<{ status: string; data: { user: any } }>("/auth/profile")
        return data.data.user
    },
}
