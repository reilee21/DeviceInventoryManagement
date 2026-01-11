import { useState, useCallback } from "react"
import { authApi } from "@/services/api"

export function useAuth() {
    const [user, setUser] = useState<any>(null)

    const login = useCallback(async (credentials: any) => {
        try {
            const data = await authApi.login(credentials)
            localStorage.setItem("access_token", data.access_token)
            setUser(data.user)
            return data
        } catch (error) {
            throw error
        }
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem("access_token")
        setUser(null)
    }, [])

    const getCurrentUser = useCallback(() => {
        return user
    }, [user])

    return {
        user,
        login,
        logout,
        getCurrentUser,
    }
}
