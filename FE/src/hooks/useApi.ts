import { useState, useCallback } from "react"

export function useApi<T>(apiFunc: (...args: any[]) => Promise<T>) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    const execute = useCallback(async (...args: any[]) => {
        setLoading(true)
        setError(null)
        try {
            const result = await apiFunc(...args)
            setData(result)
            return result
        } catch (err: any) {
            setError(err)
            console.error("API Error:", err.message || "Something went wrong")
            throw err
        } finally {
            setLoading(false)
        }
    }, [apiFunc])

    return {
        data,
        loading,
        error,
        execute,
    }
}
