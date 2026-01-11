import { useState, useCallback, useEffect } from "react"
import { useApi } from "../useApi"
import { financeApi } from "@/services/api/finance"

export function useFinanceDashboard() {
    const [period, setPeriod] = useState<string>("30d")

    const { execute: fetchData, data, loading, error } = useApi(financeApi.getDashboardData)

    const refetch = useCallback(() => {
        fetchData(period)
    }, [fetchData, period])

    useEffect(() => {
        refetch()
    }, [refetch])

    return {
        data,
        loading,
        error,
        period,
        setPeriod,
        refetch
    }
}
